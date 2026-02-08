import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { StudentProfile, StudentProfileDocument } from '../models/student-profile.schema';
import { TeacherProfile, TeacherProfileDocument } from '../models/teacher-profile.schema';
import { Class, ClassDocument } from '../models/class.schema';
import { Enrollment, EnrollmentDocument, EnrollmentStatus } from '../models/enrollment.schema';
import { User, UserDocument } from '../models/user.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(StudentProfile.name) private studentProfileModel: Model<StudentProfileDocument>,
    @InjectModel(TeacherProfile.name) private teacherProfileModel: Model<TeacherProfileDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Enrollment.name) private enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getDashboard(studentId: string) {
    return {
      upcomingSessions: [],
      newAnnouncements: [],
      unreadMessages: 0,
    };
  }

  async getClasses(query: any) {
    const classes = await this.classModel.find({ visibility: 'PUBLIC', status: 'ACTIVE' });
    return { classes };
  }

  async requestEnrollment(classId: string, studentId: string, body: any) {
    const enrollment = new this.enrollmentModel({
      classId,
      studentId,
      status: EnrollmentStatus.REQUESTED,
      requestMessage: body.message,
    });
    await enrollment.save();
    return { message: 'Enrollment requested successfully', enrollment };
  }

  async getProfile(studentId: string) {
    let student = await this.studentProfileModel
      .findOne({ userId: studentId })
      .populate('userId', 'email');
    
    // If profile doesn't exist, create a default one
    if (!student) {
      const user = await this.userModel.findById(studentId);
      
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      // Extract name from email
      const emailName = user.email.split('@')[0];
      const nameParts = emailName.split('.');
      const firstName = nameParts[0] || 'Student';
      const lastName = nameParts.slice(1).join(' ') || 'Profile';
      
      // Create a default student profile
      student = new this.studentProfileModel({
        userId: studentId,
        firstName,
        lastName,
        grade: 'Not Set', // Required field, set default
      });
      await student.save();
      
      // Populate userId after save
      await student.populate('userId', 'email');
    }
    
    return student.toObject();
  }

  async updateProfile(studentId: string, updateData: any) {
    let student = await this.studentProfileModel.findOne({ userId: studentId });
    
    // If profile doesn't exist, create a default one first
    if (!student) {
      const user = await this.userModel.findById(studentId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      // Extract name from email
      const emailName = user.email.split('@')[0];
      const nameParts = emailName.split('.');
      const firstName = nameParts[0] || 'Student';
      const lastName = nameParts.slice(1).join(' ') || 'Profile';
      
      student = new this.studentProfileModel({
        userId: studentId,
        firstName,
        lastName,
        grade: updateData.grade || 'Not Set',
      });
    }

    // Update basic fields
    if (updateData.firstName !== undefined) student.firstName = updateData.firstName;
    if (updateData.lastName !== undefined) student.lastName = updateData.lastName;
    if (updateData.grade !== undefined) student.grade = updateData.grade;
    if (updateData.school !== undefined) student.school = updateData.school;
    if (updateData.phone !== undefined) student.phone = updateData.phone;
    if (updateData.address !== undefined) student.address = updateData.address;
    if (updateData.dateOfBirth !== undefined) {
      student.dateOfBirth = new Date(updateData.dateOfBirth);
    }
    if (updateData.parentName !== undefined) student.parentName = updateData.parentName;
    if (updateData.parentContact !== undefined) student.parentContact = updateData.parentContact;
    if (updateData.parentPhone !== undefined) student.parentContact = updateData.parentPhone; // Map parentPhone to parentContact
    if (updateData.relationship !== undefined) student.relationship = updateData.relationship;
    if (updateData.learningGoals !== undefined) student.learningGoals = updateData.learningGoals;
    if (updateData.preferredSubjects !== undefined) student.preferredSubjects = updateData.preferredSubjects;
    if (updateData.parentGuardianIdNo !== undefined) student.parentGuardianIdNo = updateData.parentGuardianIdNo;
    if (updateData.image !== undefined) student.image = updateData.image;

    await student.save();
    
    // Populate userId before returning
    await student.populate('userId', 'email');
    
    return student.toObject();
  }

  async changePassword(studentId: string, body: { currentPassword: string; newPassword: string }) {
    const user = await this.userModel.findById(studentId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(body.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return {
      message: 'Password updated successfully',
    };
  }

  async getLinkedTeachers(studentId: string, query: any) {
    const studentProfile = await this.studentProfileModel.findOne({ userId: studentId });
    if (!studentProfile) {
      throw new NotFoundException('Student profile not found');
    }

    if (!studentProfile.preferredTeachers || studentProfile.preferredTeachers.length === 0) {
      return {
        teachers: [],
        pagination: {
          total: 0,
          page: query.page || 1,
          limit: query.limit || 20,
          totalPages: 0,
        },
      };
    }

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;

    const teachers = await this.teacherProfileModel
      .find({ _id: { $in: studentProfile.preferredTeachers } })
      .select('firstName lastName slug image subjects grades')
      .skip(skip)
      .limit(limit);

    const total = studentProfile.preferredTeachers.length;

    // Get enrolled classes for each teacher
    const teachersWithClasses = await Promise.all(
      teachers.map(async (teacher) => {
        const enrolledClasses = await this.enrollmentModel
          .find({
            studentId,
            status: EnrollmentStatus.APPROVED,
          })
          .populate({
            path: 'classId',
            match: { teacherId: teacher.userId },
            select: 'title status',
          });

        const validEnrollments = enrolledClasses.filter((e) => e.classId != null);

        return {
          id: teacher._id,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          slug: teacher.slug,
          profileImageUrl: teacher.image,
          subjects: teacher.subjects,
          grades: teacher.grades,
          linkedAt: studentProfile.registeredWithTeacherAt,
          enrolledClasses: validEnrollments.map((e: any) => ({
            classId: e.classId._id,
            className: e.classId.title,
            status: e.classId.status,
          })),
        };
      }),
    );

    return {
      teachers: teachersWithClasses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
