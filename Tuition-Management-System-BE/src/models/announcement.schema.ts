import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AnnouncementDocument = Announcement & Document;

@Schema({ timestamps: true })
export class Announcement {
  @Prop({ type: Types.ObjectId, ref: 'Class', required: true, index: true })
  classId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  readBy: Types.ObjectId[];
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);

// Indexes (removed duplicates - already defined in @Prop decorators)
