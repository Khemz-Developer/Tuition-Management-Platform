import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClassDocument = Class & Document;

export enum ClassVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum ClassStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DRAFT = 'DRAFT',
}

@Schema({ _id: false })
export class ScheduleRules {
  @Prop({ type: [Number], required: true })
  daysOfWeek: number[];

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ default: 'Asia/Kolkata' })
  timezone: string;

  @Prop()
  duration?: number;
}

@Schema({ timestamps: true })
export class Class {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  teacherId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, index: true })
  subject: string;

  @Prop({ required: true, index: true })
  grade: string;

  @Prop()
  fee?: number;

  @Prop({ required: true, default: 30 })
  capacity: number;

  @Prop({ default: 0 })
  currentEnrollment: number;

  @Prop({ default: false })
  autoApprove: boolean;

  @Prop({ type: ScheduleRules, _id: false, required: true })
  scheduleRules: ScheduleRules;

  @Prop({ required: true, enum: ClassVisibility, default: ClassVisibility.PUBLIC, index: true })
  visibility: ClassVisibility;

  @Prop({ required: true, enum: ClassStatus, default: ClassStatus.DRAFT, index: true })
  status: ClassStatus;

  @Prop({ required: true, unique: true, index: true })
  inviteCode: string;

  @Prop({ required: true })
  inviteLink: string;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;
}

export const ClassSchema = SchemaFactory.createForClass(Class);

// Indexes (removed duplicates - already defined in @Prop decorators)

ClassSchema.methods.generateInviteCode = function () {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

ClassSchema.methods.isFull = function () {
  return this.currentEnrollment >= this.capacity;
};

ClassSchema.methods.canEnroll = function () {
  return this.status === ClassStatus.ACTIVE && !this.isFull();
};
