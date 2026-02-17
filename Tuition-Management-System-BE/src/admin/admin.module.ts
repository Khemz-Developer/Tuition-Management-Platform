import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DynamicConfigController } from './dynamic-config.controller';
import { DynamicConfigService } from './dynamic-config.service';
import { User, UserSchema } from '../models/user.schema';
import { TeacherProfile, TeacherProfileSchema } from '../models/teacher-profile.schema';
import { StudentProfile, StudentProfileSchema } from '../models/student-profile.schema';
import { Class, ClassSchema } from '../models/class.schema';
import { AdminAuditLog, AdminAuditLogSchema } from '../models/admin-audit-log.schema';
import { DynamicConfig, DynamicConfigSchema } from '../models/dynamic-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TeacherProfile.name, schema: TeacherProfileSchema },
      { name: StudentProfile.name, schema: StudentProfileSchema },
      { name: Class.name, schema: ClassSchema },
      { name: AdminAuditLog.name, schema: AdminAuditLogSchema },
      { name: DynamicConfig.name, schema: DynamicConfigSchema },
    ]),
  ],
  controllers: [AdminController, DynamicConfigController],
  providers: [AdminService, DynamicConfigService],
  exports: [AdminService, DynamicConfigService],
})
export class AdminModule {}
