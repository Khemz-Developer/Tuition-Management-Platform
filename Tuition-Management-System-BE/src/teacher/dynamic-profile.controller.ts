import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../models/user.schema';

@Controller('teacher/dynamic-profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TEACHER)
export class DynamicProfileController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('config')
  async getDynamicProfileConfig() {
    return await this.teacherService.getDynamicProfileConfig();
  }

  @Get()
  async getDynamicProfile(@Request() req) {
    return await this.teacherService.getDynamicProfile(req.user.id);
  }

  @Put()
  async updateDynamicProfile(@Request() req, @Body() updateData: any) {
    return await this.teacherService.updateDynamicProfile(req.user.id, updateData);
  }

  @Post('enable')
  @HttpCode(HttpStatus.OK)
  async enableDynamicProfile(@Request() req, @Body() body: { templateId?: string }) {
    return await this.teacherService.enableDynamicProfile(req.user.id, body.templateId);
  }

  @Post('disable')
  @HttpCode(HttpStatus.OK)
  async disableDynamicProfile(@Request() req) {
    return await this.teacherService.disableDynamicProfile(req.user.id);
  }

  @Put('layout')
  async updateProfileLayout(@Request() req, @Body() layout: any[]) {
    return await this.teacherService.updateProfileLayout(req.user.id, layout);
  }

  @Get('templates/:templateId')
  async getProfileTemplate(@Param('templateId') templateId: string) {
    return await this.teacherService.getProfileTemplate(templateId);
  }

  @Post('apply-template/:templateId')
  @HttpCode(HttpStatus.OK)
  async applyProfileTemplate(@Request() req, @Param('templateId') templateId: string) {
    return await this.teacherService.applyProfileTemplate(req.user.id, templateId);
  }
}
