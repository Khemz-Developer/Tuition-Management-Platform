import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
}

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'Session', required: true, index: true })
  sessionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Class', required: true, index: true })
  classId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  studentId: Types.ObjectId;

  @Prop({ required: true, enum: AttendanceStatus, default: AttendanceStatus.ABSENT })
  status: AttendanceStatus;

  @Prop({ default: Date.now })
  markedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  markedBy: Types.ObjectId;

  @Prop()
  arrivedAt?: Date;

  @Prop()
  lateMinutes?: number;

  @Prop()
  notes?: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

// Compound unique index
AttendanceSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });
// Other indexes already defined in @Prop decorators
