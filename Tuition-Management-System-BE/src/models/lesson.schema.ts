import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LessonDocument = Lesson & Document;

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

@Schema({ _id: false })
export class ContentBlock {
  @Prop({ required: true })
  type: string;

  @Prop({ type: Object, required: true })
  content: any;
}

@Schema({ timestamps: true })
export class Lesson {
  @Prop({ type: Types.ObjectId, ref: 'Unit', required: true, index: true })
  unitId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, default: 0 })
  order: number;

  @Prop({ type: [ContentBlock], _id: false, default: [] })
  contentBlocks: ContentBlock[];

  @Prop()
  estimatedDuration?: number;

  @Prop({ enum: Difficulty })
  difficulty?: Difficulty;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

// Compound index for sorted queries
LessonSchema.index({ unitId: 1, order: 1 });
