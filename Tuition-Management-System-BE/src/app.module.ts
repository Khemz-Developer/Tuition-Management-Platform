import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { TeacherModule } from './teacher/teacher.module';
import { StudentModule } from './student/student.module';
import { PublicModule } from './public/public.module';
import { UploadModule } from './upload/upload.module';
import { MessagingModule } from './messaging/messaging.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthModule } from './health/health.module';
import { LocationsModule } from './locations/locations.module';
import { PublicGuard } from './guards/public.guard';
import { RolesGuard } from './guards/roles.guard';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error('MONGODB_URI is not defined in environment variables');
        }
        return {
          uri,
        };
      },
    }),

    // Rate Limiting (global default)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute (global default)
      },
    ]),

    // Feature Modules
    HealthModule,
    AuthModule,
    AdminModule,
    TeacherModule,
    StudentModule,
    PublicModule,
    UploadModule,
    MessagingModule,
    NotificationsModule,
    LocationsModule,
  ],
  providers: [
    // Global ThrottlerGuard for rate limiting on all routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global JWT auth guard using PublicGuard (respects @Public() decorator)
    {
      provide: APP_GUARD,
      useClass: PublicGuard,
    },
    // Global roles guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
