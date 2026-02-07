import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../models/user.schema';
import { TeacherProfile, TeacherProfileSchema } from '../models/teacher-profile.schema';
import { StudentProfile, StudentProfileSchema } from '../models/student-profile.schema';
import { Class, ClassSchema } from '../models/class.schema';
import { AdminAuditLog, AdminAuditLogSchema } from '../models/admin-audit-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TeacherProfile.name, schema: TeacherProfileSchema },
      { name: StudentProfile.name, schema: StudentProfileSchema },
      { name: Class.name, schema: ClassSchema },
      { name: AdminAuditLog.name, schema: AdminAuditLogSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
