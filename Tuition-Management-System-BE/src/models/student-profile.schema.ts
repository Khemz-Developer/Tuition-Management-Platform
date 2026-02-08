import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentProfileDocument = StudentProfile & Document;

@Schema({ timestamps: true })
export class StudentProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ required: true, index: true })
  grade: string;

  @Prop()
  school?: string;

  @Prop()
  parentName?: string;


  @Prop()
  parentContact?: string;

  @Prop()
  parentGuardianIdNo?: string;

  @Prop()
  image?: string;

  @Prop()
  relationship?: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop({ type: [String] })
  preferredSubjects?: string[];

  @Prop()
  learningGoals?: string;

  @Prop({ type: [Types.ObjectId], ref: 'TeacherProfile', default: [] })
  preferredTeachers?: Types.ObjectId[]; // Teachers student registered with

  @Prop({ type: Date })
  registeredWithTeacherAt?: Date; // When student registered with a teacher
}

export const StudentProfileSchema = SchemaFactory.createForClass(StudentProfile);

// Indexes (removed duplicates - already defined in @Prop decorators)
