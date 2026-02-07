import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum RecurrenceFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum LocationType {
  PHYSICAL = 'PHYSICAL',
  ONLINE = 'ONLINE',
  HYBRID = 'HYBRID',
}

@Schema({ _id: false })
export class RecurrenceRule {
  @Prop({ required: true, enum: RecurrenceFrequency })
  frequency: RecurrenceFrequency;

  @Prop({ default: 1 })
  interval: number;

  @Prop()
  endDate?: Date;

  @Prop({ type: [Number] })
  daysOfWeek?: number[];

  @Prop()
  dayOfMonth?: number;

  @Prop()
  count?: number;
}

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'Class', required: true, index: true })
  classId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, index: true })
  startDateTime: Date;

  @Prop({ required: true, index: true })
  endDateTime: Date;

  @Prop({ default: false })
  isRecurring: boolean;

  @Prop({ type: RecurrenceRule, _id: false })
  recurrenceRule?: RecurrenceRule;

  @Prop({ type: Types.ObjectId, ref: 'Session', index: true })
  parentSessionId?: Types.ObjectId;

  @Prop({ required: true, enum: SessionStatus, default: SessionStatus.SCHEDULED, index: true })
  status: SessionStatus;

  @Prop()
  cancelledAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  cancelledBy?: Types.ObjectId;

  @Prop()
  cancellationReason?: string;

  @Prop()
  location?: string;

  @Prop({ default: LocationType.PHYSICAL, enum: LocationType })
  locationType: LocationType;

  @Prop()
  meetingLink?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop()
  notes?: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

// Indexes (removed duplicates - already defined in @Prop decorators)
