import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UnitDocument = Unit & Document;

@Schema({ timestamps: true })
export class Unit {
  @Prop({ type: Types.ObjectId, ref: 'Class', required: true, index: true })
  classId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, default: 0 })
  order: number;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);

// Compound index for sorted queries
UnitSchema.index({ classId: 1, order: 1 });
