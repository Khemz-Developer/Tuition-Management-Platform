import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdminAuditLogDocument = AdminAuditLog & Document;

export enum AuditAction {
  TEACHER_APPROVED = 'TEACHER_APPROVED',
  TEACHER_REJECTED = 'TEACHER_REJECTED',
  USER_SUSPENDED = 'USER_SUSPENDED',
  USER_UNSUSPENDED = 'USER_UNSUSPENDED',
  SETTINGS_UPDATED = 'SETTINGS_UPDATED',
  CLASS_DELETED = 'CLASS_DELETED',
  ENROLLMENT_REMOVED = 'ENROLLMENT_REMOVED',
}

@Schema({ timestamps: true })
export class AdminAuditLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  adminId: Types.ObjectId;

  @Prop({ required: true, enum: AuditAction })
  action: AuditAction;

  @Prop({ required: true })
  targetType: string;

  @Prop({ type: Types.ObjectId, index: true })
  targetId?: Types.ObjectId;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const AdminAuditLogSchema = SchemaFactory.createForClass(AdminAuditLog);

// Indexes (removed duplicates - already defined in @Prop decorators)
