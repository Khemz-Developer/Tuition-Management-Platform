import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from '../models/user.schema';
import { TeacherProfile, TeacherProfileDocument, TeacherStatus } from '../models/teacher-profile.schema';
import { StudentProfile, StudentProfileDocument } from '../models/student-profile.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(TeacherProfile.name) private teacherProfileModel: Model<TeacherProfileDocument>,
    @InjectModel(StudentProfile.name) private studentProfileModel: Model<StudentProfileDocument>,
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new this.userModel({
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });
    await user.save();

    // Create profile based on role
    if (role === UserRole.TEACHER) {
      // Always create a teacher profile, even if teacherProfile data is not provided
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
        grade: 'Not Set', // Required field, set default value
      };

      // Link student to teacher if provided
      if (teacherProfileDoc) {
        studentProfileData.preferredTeachers = [teacherProfileDoc._id];
        studentProfileData.registeredWithTeacherAt = new Date();
      }

      const studentProfile = new this.studentProfileModel(studentProfileData);
      await studentProfile.save();
    }

    // Generate tokens
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

    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive || user.isSuspended) {
      throw new UnauthorizedException('Account is suspended or inactive');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);

    // Get user's name from profile
    let name = user.email.split('@')[0]; // Default to email prefix
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

    return {
      _id: user._id,
      email: user.email,
      role: user.role,
      name,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userModel.findById(payload.sub);
      if (!user || !user.isActive || user.isSuspended) {
        throw new UnauthorizedException();
      }

      return await this.generateTokens(user._id.toString(), user.email, user.role);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
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

    return {
      accessToken,
      refreshToken,
    };
  }
}
