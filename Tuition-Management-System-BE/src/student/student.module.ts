import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { User, UserSchema } from '../models/user.schema';
import { StudentProfile, StudentProfileSchema } from '../models/student-profile.schema';
import { TeacherProfile, TeacherProfileSchema } from '../models/teacher-profile.schema';
import { Class, ClassSchema } from '../models/class.schema';
import { Enrollment, EnrollmentSchema } from '../models/enrollment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: StudentProfile.name, schema: StudentProfileSchema },
      { name: TeacherProfile.name, schema: TeacherProfileSchema },
      { name: Class.name, schema: ClassSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
