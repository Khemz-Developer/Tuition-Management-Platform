import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeacherProfile, TeacherProfileDocument, TeacherStatus } from '../models/teacher-profile.schema';
import { Class, ClassDocument } from '../models/class.schema';
import { Lead, LeadDocument, LeadStatus } from '../models/lead.schema';

@Injectable()
export class PublicService {
  constructor(
    @InjectModel(TeacherProfile.name) private teacherProfileModel: Model<TeacherProfileDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
  ) {}

  async getTeachers() {
    const teachers = await this.teacherProfileModel.find({ status: TeacherStatus.APPROVED });
    return { teachers };
  }

  async getTeacherProfile(slug: string) {
    const teacher = await this.teacherProfileModel.findOne({ slug, status: TeacherStatus.APPROVED });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const publicClasses = await this.classModel.find({
      teacherId: (teacher as any).userId,
      visibility: 'PUBLIC',
      status: 'ACTIVE',
    });

    return {
      ...teacher.toObject(),
      publicClasses,
      websiteConfig: teacher.websiteConfig,
    };
  }

  async contactTeacher(slug: string, body: any) {
    const teacher = await this.teacherProfileModel.findOne({ slug, status: TeacherStatus.APPROVED });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const lead = new this.leadModel({
      teacherId: teacher._id,
      studentName: body.studentName,
      grade: body.grade,
      contactMethod: body.contactMethod,
      contactValue: body.contactValue,
      preferredSubject: body.preferredSubject,
      message: body.message,
      status: LeadStatus.NEW,
    });
    await lead.save();

    return { message: 'Thank you! We\'ll contact you soon.', leadId: lead._id };
  }
}
