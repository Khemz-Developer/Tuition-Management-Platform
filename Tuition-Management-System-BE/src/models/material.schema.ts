import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MaterialDocument = Material & Document;

export enum MaterialType {
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  LINK = 'LINK',
  IMAGE = 'IMAGE',
}

@Schema({ _id: false })
export class MaterialMetadata {
  @Prop()
  size?: number;

  @Prop()
  duration?: number;

  @Prop()
  mimeType?: string;

  @Prop()
  pages?: number;

  @Prop()
  width?: number;

  @Prop()
  height?: number;
}

@Schema({ timestamps: true })
export class Material {
  @Prop({ type: Types.ObjectId, ref: 'Lesson', required: true, index: true })
  lessonId: Types.ObjectId;

  @Prop({ required: true, enum: MaterialType })
  type: MaterialType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  thumbnailUrl?: string;

  @Prop({ type: MaterialMetadata, _id: false })
  metadata?: MaterialMetadata;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);

// Indexes (removed duplicates - already defined in @Prop decorators)
