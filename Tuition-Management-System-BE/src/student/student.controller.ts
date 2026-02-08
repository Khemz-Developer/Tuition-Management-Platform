import { Controller, Get, Post, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserRole } from '../models/user.schema';

@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser() user: any) {
    return this.studentService.getDashboard(user.id);
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.studentService.getProfile(user.id);
  }

  @Put('profile')
  async updateProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.studentService.updateProfile(user.id, body);
  }

  @Put('change-password')
  async changePassword(@CurrentUser() user: any, @Body() body: any) {
    return this.studentService.changePassword(user.id, body);
  }

  @Get('classes')
  async getClasses(@Query() query: any) {
    return this.studentService.getClasses(query);
  }

  @Get('teachers')
  async getLinkedTeachers(@CurrentUser() user: any, @Query() query: any) {
    return this.studentService.getLinkedTeachers(user.id, query);
  }

  @Post('classes/:id/enroll')
  async requestEnrollment(@Param('id') id: string, @CurrentUser() user: any, @Query() body: any) {
    return this.studentService.requestEnrollment(id, user.id, body);
  }
}
