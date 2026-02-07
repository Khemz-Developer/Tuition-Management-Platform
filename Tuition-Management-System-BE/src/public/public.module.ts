import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { TeacherProfile, TeacherProfileSchema } from '../models/teacher-profile.schema';
import { Class, ClassSchema } from '../models/class.schema';
import { Lead, LeadSchema } from '../models/lead.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TeacherProfile.name, schema: TeacherProfileSchema },
      { name: Class.name, schema: ClassSchema },
      { name: Lead.name, schema: LeadSchema },
    ]),
  ],
  controllers: [PublicController],
  providers: [PublicService],
  exports: [PublicService],
})
export class PublicModule {}
