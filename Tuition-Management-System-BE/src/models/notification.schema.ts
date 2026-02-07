import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  ENROLLMENT_REQUEST = 'ENROLLMENT_REQUEST',
  ENROLLMENT_APPROVED = 'ENROLLMENT_APPROVED',
  ENROLLMENT_REJECTED = 'ENROLLMENT_REJECTED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  NEW_ANNOUNCEMENT = 'NEW_ANNOUNCEMENT',
  NEW_MATERIAL = 'NEW_MATERIAL',
  SESSION_REMINDER = 'SESSION_REMINDER',
  ATTENDANCE_MARKED = 'ATTENDANCE_MARKED',
  TEACHER_APPROVED = 'TEACHER_APPROVED',
  TEACHER_REJECTED = 'TEACHER_REJECTED',
  LEAD_RECEIVED = 'LEAD_RECEIVED',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ type: Object, required: true })
  payload: Record<string, any>;

  @Prop({ default: false })
  read: boolean;

  @Prop()
  readAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Indexes (removed duplicates - already defined in @Prop decorators)
