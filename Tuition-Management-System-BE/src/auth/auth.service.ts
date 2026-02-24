import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, UserDocument, UserRole } from '../models/user.schema';
import { TeacherProfile, TeacherProfileDocument, TeacherStatus } from '../models/teacher-profile.schema';
import { StudentProfile, StudentProfileDocument } from '../models/student-profile.schema';
import { RefreshToken, RefreshTokenDocument } from '../models/refresh-token.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

// Bcrypt rounds: 12 for high-security contexts
const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(TeacherProfile.name) private teacherProfileModel: Model<TeacherProfileDocument>,
    @InjectModel(StudentProfile.name) private studentProfileModel: Model<StudentProfileDocument>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, role, firstName, lastName, teacherProfile, teacherId, teacherSlug } = registerDto;

    // Check if user exists
    const existingUser = await this.userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate and find teacher if teacherId or teacherSlug provided
    let teacherProfileDoc: TeacherProfileDocument | null = null;
    if (role === UserRole.STUDENT && (teacherId || teacherSlug)) {
      if (teacherId) {
        teacherProfileDoc = await this.teacherProfileModel.findById(teacherId);
      } else if (teacherSlug) {
        teacherProfileDoc = await this.teacherProfileModel.findOne({ slug: teacherSlug });
      }

      if (!teacherProfileDoc) {
        throw new NotFoundException('Teacher not found');
      }

      if (teacherProfileDoc.status !== TeacherStatus.APPROVED) {
        throw new BadRequestException('Teacher is not approved. Please register with an approved teacher.');
      }
    }

    // Hash password with higher bcrypt rounds
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Create user
    const user = new this.userModel({
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });
    await user.save();

    // Create profile based on role
    if (role === UserRole.TEACHER) {
      const slug = `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newTeacherProfileDoc = new this.teacherProfileModel({
        userId: user._id,
        firstName,
        lastName,
        slug,
        subjects: teacherProfile?.subjects || [],
        grades: teacherProfile?.grades || [],
        bio: teacherProfile?.bio || '',
        location: teacherProfile?.location || {},
        status: TeacherStatus.PENDING,
      });
      await newTeacherProfileDoc.save();
    } else if (role === UserRole.STUDENT) {
      const studentProfileData: any = {
        userId: user._id,
        firstName,
        lastName,
        grade: 'Not Set',
      };

      if (teacherProfileDoc) {
        studentProfileData.preferredTeachers = [teacherProfileDoc._id];
        studentProfileData.registeredWithTeacherAt = new Date();
      }

      const studentProfile = new this.studentProfileModel(studentProfileData);
      await studentProfile.save();
    }

    // Generate tokens and store refresh token in DB
    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);

    return {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: `${registerDto.firstName} ${registerDto.lastName}`,
      },
      tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Use generic "Invalid credentials" message for both missing user and wrong password
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive || user.isSuspended) {
      // Generic message to avoid revealing account state
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);

    // Get user's name from profile
    const name = await this.getUserName(user);

    return {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name,
      },
      tokens,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const name = await this.getUserName(user);

    return {
      _id: user._id,
      email: user.email,
      role: user.role,
      name,
    };
  }

  async refreshToken(oldRefreshToken: string) {
    try {
      // Verify the JWT signature/expiry
      const payload = this.jwtService.verify(oldRefreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Check if the refresh token exists in DB and is not revoked
      const storedToken = await this.refreshTokenModel.findOne({
        token: oldRefreshToken,
        isRevoked: false,
      });

      if (!storedToken) {
        // Token reuse detected! Revoke all tokens for this user
        await this.revokeAllUserTokens(payload.sub);
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.userModel.findById(payload.sub);
      if (!user || !user.isActive || user.isSuspended) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Revoke old refresh token (token rotation)
      storedToken.isRevoked = true;
      storedToken.revokedAt = new Date();

      // Generate new tokens
      const newTokens = await this.generateTokens(user._id.toString(), user.email, user.role);

      // Link old token to new one
      storedToken.replacedByToken = newTokens.refreshToken;
      await storedToken.save();

      return newTokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    try {
      // Revoke the refresh token in DB
      const storedToken = await this.refreshTokenModel.findOne({
        token: refreshToken,
        isRevoked: false,
      });

      if (storedToken) {
        storedToken.isRevoked = true;
        storedToken.revokedAt = new Date();
        await storedToken.save();
      }

      return { message: 'Logged out successfully' };
    } catch {
      // Even if token is invalid, return success (don't leak info)
      return { message: 'Logged out successfully' };
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    user.password = await bcrypt.hash(changePasswordDto.newPassword, BCRYPT_ROUNDS);
    await user.save();

    // Revoke all existing refresh tokens (force re-login on all devices)
    await this.revokeAllUserTokens(userId);

    return { message: 'Password changed successfully. Please log in again.' };
  }

  // --- Private helpers ---

  private async getUserName(user: UserDocument): Promise<string> {
    let name = user.email.split('@')[0];
    if (user.role === UserRole.TEACHER) {
      const teacherProfile = await this.teacherProfileModel.findOne({ userId: user._id });
      if (teacherProfile) {
        name = `${teacherProfile.firstName} ${teacherProfile.lastName}`;
      }
    } else if (user.role === UserRole.STUDENT) {
      const studentProfile = await this.studentProfileModel.findOne({ userId: user._id });
      if (studentProfile) {
        name = `${studentProfile.firstName} ${studentProfile.lastName}`;
      }
    } else if (user.role === UserRole.ADMIN) {
      name = 'Admin';
    }
    return name;
  }

  private async generateTokens(userId: string, email: string, role: UserRole) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRY') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRY') || '7d',
    });

    // Store refresh token in DB
    const refreshExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRY') || '7d';
    const expiresAt = new Date();
    const daysMatch = refreshExpiry.match(/(\d+)d/);
    const hoursMatch = refreshExpiry.match(/(\d+)h/);
    if (daysMatch) {
      expiresAt.setDate(expiresAt.getDate() + parseInt(daysMatch[1]));
    } else if (hoursMatch) {
      expiresAt.setHours(expiresAt.getHours() + parseInt(hoursMatch[1]));
    } else {
      expiresAt.setDate(expiresAt.getDate() + 7); // Default 7 days
    }

    await this.refreshTokenModel.create({
      userId,
      token: refreshToken,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async revokeAllUserTokens(userId: string) {
    await this.refreshTokenModel.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true, revokedAt: new Date() },
    );
  }
}
