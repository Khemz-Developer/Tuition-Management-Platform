import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ _id: false })
export class Attachment {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  name?: string;

  @Prop()
  size?: number;
}

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true, index: true })
  conversationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  senderId: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ type: [Attachment], _id: false, default: [] })
  attachments: Attachment[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  readBy: Types.ObjectId[];

  @Prop()
  editedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Indexes (removed duplicates - already defined in @Prop decorators)
