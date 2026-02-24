import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async updateTeacherStatus(id: string, status: string, adminId: string, reason?: string) {
    const teacher = await this.teacherProfileModel.findById(id);
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const validStatuses = [TeacherStatus.PENDING, TeacherStatus.APPROVED, TeacherStatus.REJECTED];
    if (!validStatuses.includes(status as TeacherStatus)) {
      throw new BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    if (status === TeacherStatus.REJECTED && !reason?.trim()) {
      throw new BadRequestException('Reason is required when rejecting a teacher');
    }

    const previousStatus = teacher.status;
    teacher.status = status as TeacherStatus;

    if (status === TeacherStatus.APPROVED) {
      teacher.approvedAt = new Date();
      teacher.approvedBy = adminId as any;
      teacher.rejectedAt = undefined;
      teacher.rejectedBy = undefined;
      teacher.rejectionReason = undefined;
    } else if (status === TeacherStatus.REJECTED) {
      teacher.rejectedAt = new Date();
      teacher.rejectedBy = adminId as any;
      teacher.rejectionReason = reason?.trim() || '';
      teacher.approvedAt = undefined;
      teacher.approvedBy = undefined;
    } else {
      // PENDING
      teacher.approvedAt = undefined;
      teacher.approvedBy = undefined;
      teacher.rejectedAt = undefined;
      teacher.rejectedBy = undefined;
      teacher.rejectionReason = undefined;
    }

    await teacher.save();

    await this.createAuditLog(adminId, AuditAction.TEACHER_STATUS_UPDATED, 'TeacherProfile', id, {
      previousStatus,
      newStatus: status,
      reason: status === TeacherStatus.REJECTED ? reason : undefined,
    });

    return { message: 'Teacher status updated successfully', teacher };
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

  private getTeacherUserIdFromClass(c: any): string | null {
    const t = c?.teacherId;
    if (!t) return null;
    if (typeof t === 'object' && t !== null && '_id' in t) return (t._id && String(t._id)) || null;
    return String(t);
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
        .lean()
        .exec(),
      this.classModel.countDocuments(),
    ]);

    const teacherIdStrings = [...new Set((classes as any[]).map((c) => this.getTeacherUserIdFromClass(c)).filter(Boolean))];
    const teacherProfiles = teacherIdStrings.length
      ? await this.teacherProfileModel
          .find({ userId: { $in: teacherIdStrings } })
          .select('userId firstName lastName')
          .lean()
          .exec()
      : [];
    const teacherNameByUserId = new Map<string, string>();
    for (const tp of teacherProfiles) {
      const uid = (tp as any).userId?.toString?.() ?? String((tp as any).userId ?? '');
      const name = [tp.firstName, tp.lastName].filter(Boolean).join(' ').trim() || 'Teacher';
      if (uid) teacherNameByUserId.set(uid, name);
    }

    const data = (classes as any[]).map((c) => {
      const plain = { ...c };
      const tid = this.getTeacherUserIdFromClass(plain);
      const teacherName = tid ? teacherNameByUserId.get(tid) : null;
      const teacherUser = plain.teacherId && typeof plain.teacherId === 'object' ? plain.teacherId : null;
      plain.teacher = {
        _id: plain.teacherId?._id ?? plain.teacherId,
        name: teacherName ?? teacherUser?.email ?? 'N/A',
        email: teacherUser?.email ?? '',
      };
      return plain;
    });

    return createPaginationResult(data, total, page, limit);
  }

  async getClassById(id: string) {
    const cls = await this.classModel.findById(id).populate('teacherId', 'email').lean().exec();
    if (!cls) throw new NotFoundException('Class not found');
    const tid = this.getTeacherUserIdFromClass(cls);
    let teacherName = 'N/A';
    const teacherEmail = (cls as any).teacherId?.email ?? '';
    if (tid) {
      try {
        const profile = await this.teacherProfileModel
          .findOne({ userId: new Types.ObjectId(tid) })
          .select('firstName lastName')
          .lean()
          .exec();
        if (profile && (profile.firstName || profile.lastName))
          teacherName = [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim();
        else if (teacherEmail) teacherName = teacherEmail;
      } catch {
        if (teacherEmail) teacherName = teacherEmail;
      }
    } else if (teacherEmail) {
      teacherName = teacherEmail;
    }
    return {
      ...cls,
      teacher: {
        _id: (cls as any).teacherId?._id ?? (cls as any).teacherId,
        name: teacherName,
        email: teacherEmail,
      },
    };
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
