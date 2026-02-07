import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { TeacherProfile, TeacherProfileDocument, TeacherStatus } from '../models/teacher-profile.schema';
import { StudentProfile, StudentProfileDocument } from '../models/student-profile.schema';
import { Class, ClassDocument } from '../models/class.schema';
import { AdminAuditLog, AdminAuditLogDocument, AuditAction } from '../models/admin-audit-log.schema';
import { getPaginationOptions, createPaginationResult } from '../utils/pagination.util';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(TeacherProfile.name) private teacherProfileModel: Model<TeacherProfileDocument>,
    @InjectModel(StudentProfile.name) private studentProfileModel: Model<StudentProfileDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(AdminAuditLog.name) private auditLogModel: Model<AdminAuditLogDocument>,
  ) {}

  async getDashboard() {
    const [totalTeachers, pendingTeachers, totalStudents, totalClasses] = await Promise.all([
      this.teacherProfileModel.countDocuments({ status: TeacherStatus.APPROVED }),
      this.teacherProfileModel.countDocuments({ status: TeacherStatus.PENDING }),
      this.studentProfileModel.countDocuments(),
      this.classModel.countDocuments(),
    ]);

    return {
      stats: {
        totalTeachers,
        pendingTeachers,
        totalStudents,
        totalClasses,
      },
    };
  }

  async getTeachers(query: any) {
    const { page, limit, sort, order } = getPaginationOptions(query);
    const status = query.status;
    const search = query.search;

    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const [teachers, total] = await Promise.all([
      this.teacherProfileModel
        .find(filter)
        .populate('userId', 'email')
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.teacherProfileModel.countDocuments(filter),
    ]);

    return createPaginationResult(teachers, total, page, limit);
  }

  async getTeacher(id: string) {
    const teacher = await this.teacherProfileModel
      .findById(id)
      .populate('userId', 'email')
      .exec();
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    return teacher;
  }

  async approveTeacher(id: string, adminId: string) {
    const teacher = await this.teacherProfileModel.findById(id);
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    teacher.status = TeacherStatus.APPROVED;
    teacher.approvedAt = new Date();
    teacher.approvedBy = adminId as any;
    await teacher.save();

    // Create audit log
    await this.createAuditLog(adminId, AuditAction.TEACHER_APPROVED, 'TeacherProfile', id);

    return { message: 'Teacher approved successfully', teacher };
  }

  async rejectTeacher(id: string, reason: string, adminId: string) {
    const teacher = await this.teacherProfileModel.findById(id);
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    teacher.status = TeacherStatus.REJECTED;
    teacher.rejectedAt = new Date();
    teacher.rejectedBy = adminId as any;
    teacher.rejectionReason = reason;
    await teacher.save();

    // Create audit log
    await this.createAuditLog(adminId, AuditAction.TEACHER_REJECTED, 'TeacherProfile', id, { reason });

    return { message: 'Teacher rejected successfully', teacher };
  }

  async getStudents(query: any) {
    const { page, limit, sort, order } = getPaginationOptions(query);
    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const [students, total] = await Promise.all([
      this.studentProfileModel
        .find()
        .populate('userId', 'email')
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.studentProfileModel.countDocuments(),
    ]);

    return createPaginationResult(students, total, page, limit);
  }

  async getClasses(query: any) {
    const { page, limit, sort, order } = getPaginationOptions(query);
    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const [classes, total] = await Promise.all([
      this.classModel
        .find()
        .populate('teacherId', 'email')
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.classModel.countDocuments(),
    ]);

    return createPaginationResult(classes, total, page, limit);
  }

  async suspendUser(id: string, reason: string, adminId: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isSuspended = true;
    user.suspendedAt = new Date();
    user.suspendedBy = adminId as any;
    user.suspensionReason = reason;
    await user.save();

    await this.createAuditLog(adminId, AuditAction.USER_SUSPENDED, 'User', id, { reason });

    return { message: 'User suspended successfully' };
  }

  async unsuspendUser(id: string, adminId: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isSuspended = false;
    user.suspendedAt = undefined;
    user.suspendedBy = undefined;
    user.suspensionReason = undefined;
    await user.save();

    await this.createAuditLog(adminId, AuditAction.USER_UNSUSPENDED, 'User', id);

    return { message: 'User unsuspended successfully' };
  }

  async getAnalytics() {
    // Basic analytics - can be expanded
    const stats = await this.getDashboard();
    return stats;
  }

  async getAuditLogs(query: any) {
    const { page, limit, sort, order } = getPaginationOptions(query);
    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const [logs, total] = await Promise.all([
      this.auditLogModel
        .find()
        .populate('adminId', 'email')
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.auditLogModel.countDocuments(),
    ]);

    return createPaginationResult(logs, total, page, limit);
  }

  private async createAuditLog(
    adminId: string,
    action: AuditAction,
    targetType: string,
    targetId?: string,
    metadata?: Record<string, any>,
  ) {
    const log = new this.auditLogModel({
      adminId,
      action,
      targetType,
      targetId,
      metadata,
    });
    await log.save();
  }
}
