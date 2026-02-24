import { Controller, Get, Post, Put, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserRole } from '../models/user.schema';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('teachers')
  async getTeachers(@Query() query: any) {
    return this.adminService.getTeachers(query);
  }

  @Get('teachers/:id')
  async getTeacher(@Param('id') id: string) {
    return this.adminService.getTeacher(id);
  }

  @Post('teachers/:id/approve')
  async approveTeacher(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.approveTeacher(id, user.id);
  }

  @Post('teachers/:id/reject')
  async rejectTeacher(@Param('id') id: string, @Body() body: { reason: string }, @CurrentUser() user: any) {
    return this.adminService.rejectTeacher(id, body.reason, user.id);
  }

  @Patch('teachers/:id/status')
  async updateTeacherStatus(
    @Param('id') id: string,
    @Body() body: { status: string; reason?: string },
    @CurrentUser() user: any,
  ) {
    return this.adminService.updateTeacherStatus(id, body.status, user.id, body.reason);
  }

  @Get('students')
  async getStudents(@Query() query: any) {
    return this.adminService.getStudents(query);
  }

  @Get('classes')
  async getClasses(@Query() query: any) {
    return this.adminService.getClasses(query);
  }

  @Get('classes/:id')
  async getClass(@Param('id') id: string) {
    return this.adminService.getClassById(id);
  }

  @Post('users/:id/suspend')
  async suspendUser(@Param('id') id: string, @Body() body: { reason: string }, @CurrentUser() user: any) {
    return this.adminService.suspendUser(id, body.reason, user.id);
  }

  @Post('users/:id/unsuspend')
  async unsuspendUser(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.unsuspendUser(id, user.id);
  }

  @Get('analytics')
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('audit-logs')
  async getAuditLogs(@Query() query: any) {
    return this.adminService.getAuditLogs(query);
  }
}
