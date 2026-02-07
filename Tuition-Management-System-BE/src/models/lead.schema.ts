import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeadDocument = Lead & Document;

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  INTERESTED = 'INTERESTED',
  NOT_INTERESTED = 'NOT_INTERESTED',
  ENROLLED = 'ENROLLED',
}

export enum ContactMethod {
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  PHONE = 'PHONE',
}

@Schema({ timestamps: true })
export class Lead {
  @Prop({ type: Types.ObjectId, ref: 'TeacherProfile', required: true, index: true })
  teacherId: Types.ObjectId;

  @Prop({ required: true })
  studentName: string;

  @Prop({ required: true })
  grade: string;

  @Prop({ required: true, enum: ContactMethod })
  contactMethod: ContactMethod;

  @Prop({ required: true })
  contactValue: string;

  @Prop()
  preferredSubject?: string;

  @Prop()
  message?: string;

  @Prop({ required: true, enum: LeadStatus, default: LeadStatus.NEW, index: true })
  status: LeadStatus;

  @Prop()
  notes?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  contactedBy?: Types.ObjectId;

  @Prop()
  contactedAt?: Date;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

// Indexes (removed duplicates - already defined in @Prop decorators)
