import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeacherProfile, TeacherProfileDocument } from '../models/teacher-profile.schema';
import { Class, ClassDocument } from '../models/class.schema';
import { StudentProfile, StudentProfileDocument } from '../models/student-profile.schema';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(TeacherProfile.name) private teacherProfileModel: Model<TeacherProfileDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(StudentProfile.name) private studentProfileModel: Model<StudentProfileDocument>,
  ) {}

  async getDashboard(teacherId: string) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const totalClasses = await this.classModel.countDocuments({ teacherId });
    // Add more stats as needed

    return {
      stats: {
        totalClasses,
        totalStudents: teacher.stats.totalStudents,
        upcomingSessions: 0,
        unreadMessages: 0,
      },
    };
  }

  async getProfile(teacherId: string) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }
    return teacher;
  }

  async updateProfile(teacherId: string, updateData: any) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    Object.assign(teacher, updateData);
    await teacher.save();
    return { message: 'Profile updated successfully', teacher };
  }

  async getClasses(teacherId: string, query: any) {
    const classes = await this.classModel.find({ teacherId });
    return { classes };
  }

  async createClass(teacherId: string, classData: any) {
    const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const classDoc = new this.classModel({
      ...classData,
      teacherId,
      inviteCode,
      inviteLink: `https://app.com/join/${inviteCode}`,
    });
    await classDoc.save();
    return { message: 'Class created successfully', class: classDoc };
  }

  async getWebsiteConfig(teacherId: string) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }
    return { websiteConfig: teacher.websiteConfig || {} };
  }

  async updateWebsiteConfig(teacherId: string, config: any) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    teacher.websiteConfig = config.websiteConfig;
    await teacher.save();
    return { message: 'Website configuration updated successfully', websiteConfig: teacher.websiteConfig };
  }

  async getRegisteredStudents(teacherId: string, query: any) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    // Find all students who have this teacher in their preferredTeachers array
    const students = await this.studentProfileModel
      .find({ preferredTeachers: teacher._id })
      .populate('userId', 'email isActive')
      .sort({ registeredWithTeacherAt: -1 })
      .limit(query.limit || 50)
      .skip(query.skip || 0);

    const total = await this.studentProfileModel.countDocuments({ preferredTeachers: teacher._id });

    return {
      students,
      pagination: {
        total,
        limit: query.limit || 50,
        skip: query.skip || 0,
      },
    };
  }
}
