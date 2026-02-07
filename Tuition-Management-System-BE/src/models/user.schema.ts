import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, index: true })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isSuspended: boolean;

  @Prop()
  suspendedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  suspendedBy?: Types.ObjectId;

  @Prop()
  suspensionReason?: string;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  emailVerifiedAt?: Date;

  @Prop({ index: true })
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes (removed duplicates - already defined in @Prop decorators)
// Only add compound or additional indexes here if needed
