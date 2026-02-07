import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentProfile, StudentProfileDocument } from '../models/student-profile.schema';
import { TeacherProfile, TeacherProfileDocument } from '../models/teacher-profile.schema';
import { Class, ClassDocument } from '../models/class.schema';
import { Enrollment, EnrollmentDocument, EnrollmentStatus } from '../models/enrollment.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(StudentProfile.name) private studentProfileModel: Model<StudentProfileDocument>,
    @InjectModel(TeacherProfile.name) private teacherProfileModel: Model<TeacherProfileDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Enrollment.name) private enrollmentModel: Model<EnrollmentDocument>,
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
