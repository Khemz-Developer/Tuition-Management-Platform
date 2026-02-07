import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { User, UserSchema } from '../models/user.schema';
import { TeacherProfile, TeacherProfileSchema } from '../models/teacher-profile.schema';
import { StudentProfile, StudentProfileSchema } from '../models/student-profile.schema';
import { Class, ClassSchema } from '../models/class.schema';
import { Enrollment, EnrollmentSchema } from '../models/enrollment.schema';
import { Session, SessionSchema } from '../models/session.schema';
import { Attendance, AttendanceSchema } from '../models/attendance.schema';
import { Unit, UnitSchema } from '../models/unit.schema';
import { Lesson, LessonSchema } from '../models/lesson.schema';
import { Material, MaterialSchema } from '../models/material.schema';
import { Lead, LeadSchema } from '../models/lead.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TeacherProfile.name, schema: TeacherProfileSchema },
      { name: StudentProfile.name, schema: StudentProfileSchema },
      { name: Class.name, schema: ClassSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Unit.name, schema: UnitSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: Material.name, schema: MaterialSchema },
      { name: Lead.name, schema: LeadSchema },
    ]),
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}
