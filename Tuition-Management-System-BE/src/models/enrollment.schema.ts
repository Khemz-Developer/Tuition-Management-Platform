import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EnrollmentDocument = Enrollment & Document;

export enum EnrollmentStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REMOVED = 'REMOVED',
}

@Schema({ timestamps: true })
export class Enrollment {
  @Prop({ type: Types.ObjectId, ref: 'Class', required: true, index: true })
  classId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  studentId: Types.ObjectId;

  @Prop({ required: true, enum: EnrollmentStatus, default: EnrollmentStatus.REQUESTED, index: true })
  status: EnrollmentStatus;

  @Prop({ default: Date.now })
  requestedAt: Date;

  @Prop()
  requestMessage?: string;

  @Prop()
  approvedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop()
  rejectedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  rejectedBy?: Types.ObjectId;

  @Prop()
  rejectionReason?: string;

  @Prop()
  removedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  removedBy?: Types.ObjectId;

  @Prop()
  removalReason?: string;

  @Prop()
  joinedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  invitedBy?: Types.ObjectId;

  @Prop()
  inviteCode?: string;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);

// Compound unique index
EnrollmentSchema.index({ classId: 1, studentId: 1 }, { unique: true });
// Other indexes already defined in @Prop decorators
