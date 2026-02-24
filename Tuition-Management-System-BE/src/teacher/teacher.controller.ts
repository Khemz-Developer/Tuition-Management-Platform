import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserRole } from '../models/user.schema';

@Controller('teacher')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TEACHER)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser() user: any) {
    return this.teacherService.getDashboard(user.id);
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.teacherService.getProfile(user.id);
  }

  @Get('config')
  async getConfig() {
    return this.teacherService.getPublicConfig();
  }

  @Put('profile')
  async updateProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.teacherService.updateProfile(user.id, body);
  }

  @Get('classes')
  async getClasses(@CurrentUser() user: any, @Query() query: any) {
    return this.teacherService.getClasses(user.id, query);
  }

  @Post('classes')
  async createClass(@CurrentUser() user: any, @Body() body: any) {
    return this.teacherService.createClass(user.id, body);
  }

  @Get('classes/:id')
  async getClass(@CurrentUser() user: any, @Param('id') id: string) {
    return this.teacherService.getClass(user.id, id);
  }

  @Put('classes/:id')
  async updateClass(@CurrentUser() user: any, @Param('id') id: string, @Body() body: any) {
    return this.teacherService.updateClass(user.id, id, body);
  }

  @Patch('classes/:id')
  async patchClass(@CurrentUser() user: any, @Param('id') id: string, @Body() body: any) {
    return this.teacherService.updateClass(user.id, id, body);
  }

  @Delete('classes/:id')
  async deleteClass(@CurrentUser() user: any, @Param('id') id: string) {
    return this.teacherService.deleteClass(user.id, id);
  }

  @Get('website/config')
  async getWebsiteConfig(@CurrentUser() user: any) {
    return this.teacherService.getWebsiteConfig(user.id);
  }

  @Put('website/config')
  async updateWebsiteConfig(@CurrentUser() user: any, @Body() body: any) {
    return this.teacherService.updateWebsiteConfig(user.id, body);
  }

  @Get('students')
  async getRegisteredStudents(@CurrentUser() user: any, @Query() query: any) {
    return this.teacherService.getRegisteredStudents(user.id, query);
  }
}
