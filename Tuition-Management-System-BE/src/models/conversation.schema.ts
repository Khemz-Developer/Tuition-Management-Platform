import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

export enum ConversationType {
  DIRECT = 'DIRECT',
  CLASS = 'CLASS',
}

@Schema({ _id: false })
export class LastMessage {
  @Prop()
  text?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  senderId?: Types.ObjectId;

  @Prop()
  createdAt?: Date;
}

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true, enum: ConversationType, index: true })
  type: ConversationType;

  @Prop({ type: Types.ObjectId, ref: 'Class', index: true })
  classId?: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', required: true, index: true })
  participants: Types.ObjectId[];

  @Prop({ index: true })
  lastMessageAt?: Date;

  @Prop({ type: LastMessage, _id: false })
  lastMessage?: LastMessage;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Indexes (removed duplicates - already defined in @Prop decorators)
