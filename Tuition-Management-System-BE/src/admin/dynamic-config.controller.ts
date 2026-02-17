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
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { DynamicConfigService } from './dynamic-config.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../models/user.schema';

@Controller('admin/dynamic-config')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class DynamicConfigController {
  constructor(private readonly dynamicConfigService: DynamicConfigService) {}

  @Get()
  async getConfig(@Query('key') key: string = 'default') {
    return await this.dynamicConfigService.getConfig(key);
  }

  @Get('public')
  async getPublicConfig() {
    return await this.dynamicConfigService.getPublicConfig();
  }

  @Put()
  async updateConfig(@Body() updateData: any, @Query('key') key: string = 'default') {
    return await this.dynamicConfigService.updateConfig(key, updateData);
  }

  // Education Levels Management
  @Post('education-levels')
  @HttpCode(HttpStatus.CREATED)
  async addEducationLevel(@Body() educationLevel: any, @Query('key') key: string = 'default') {
    return await this.dynamicConfigService.addEducationLevel(key, educationLevel);
  }

  @Put('education-levels/:levelCode')
  async updateEducationLevel(
    @Param('levelCode') levelCode: string,
    @Body() updateData: any,
    @Query('key') key: string = 'default'
  ) {
    return await this.dynamicConfigService.updateEducationLevel(key, levelCode, updateData);
  }

  @Delete('education-levels/:levelCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeEducationLevel(@Param('levelCode') levelCode: string, @Query('key') key: string = 'default') {
    await this.dynamicConfigService.removeEducationLevel(key, levelCode);
  }

  // Subjects Management
  @Post('subjects')
  @HttpCode(HttpStatus.CREATED)
  async addSubject(@Body() subject: any, @Query('key') key: string = 'default') {
    return await this.dynamicConfigService.addSubject(key, subject);
  }

  @Put('subjects/:subjectCode')
  async updateSubject(
    @Param('subjectCode') subjectCode: string,
    @Body() updateData: any,
    @Query('key') key: string = 'default'
  ) {
    return await this.dynamicConfigService.updateSubject(key, subjectCode, updateData);
  }

  @Delete('subjects/:subjectCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSubject(@Param('subjectCode') subjectCode: string, @Query('key') key: string = 'default') {
    await this.dynamicConfigService.removeSubject(key, subjectCode);
  }

  // Grades Management
  @Post('grades')
  @HttpCode(HttpStatus.CREATED)
  async addGrade(@Body() grade: any, @Query('key') key: string = 'default') {
    return await this.dynamicConfigService.addGrade(key, grade);
  }

  @Put('grades/:gradeCode')
  async updateGrade(
    @Param('gradeCode') gradeCode: string,
    @Body() updateData: any,
    @Query('key') key: string = 'default'
  ) {
    return await this.dynamicConfigService.updateGrade(key, gradeCode, updateData);
  }

  @Delete('grades/:gradeCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeGrade(@Param('gradeCode') gradeCode: string, @Query('key') key: string = 'default') {
    await this.dynamicConfigService.removeGrade(key, gradeCode);
  }

  // Profile Sections Management
  @Post('profile-sections')
  @HttpCode(HttpStatus.CREATED)
  async addProfileSection(@Body() section: any, @Query('key') key: string = 'default') {
    return await this.dynamicConfigService.addProfileSection(key, section);
  }

  @Put('profile-sections/:sectionId')
  async updateProfileSection(
    @Param('sectionId') sectionId: string,
    @Body() updateData: any,
    @Query('key') key: string = 'default'
  ) {
    return await this.dynamicConfigService.updateProfileSection(key, sectionId, updateData);
  }

  @Delete('profile-sections/:sectionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeProfileSection(@Param('sectionId') sectionId: string, @Query('key') key: string = 'default') {
    await this.dynamicConfigService.removeProfileSection(key, sectionId);
  }

  @Put('profile-sections/reorder')
  async reorderProfileSections(
    @Body() sectionOrders: { id: string; order: number }[],
    @Query('key') key: string = 'default'
  ) {
    return await this.dynamicConfigService.reorderProfileSections(key, sectionOrders);
  }

  // Profile Templates Management
  @Post('profile-templates')
  @HttpCode(HttpStatus.CREATED)
  async addProfileTemplate(@Body() template: any, @Query('key') key: string = 'default') {
    return await this.dynamicConfigService.addProfileTemplate(key, template);
  }

  @Put('profile-templates/:templateId')
  async updateProfileTemplate(
    @Param('templateId') templateId: string,
    @Body() updateData: any,
    @Query('key') key: string = 'default'
  ) {
    return await this.dynamicConfigService.updateProfileTemplate(key, templateId, updateData);
  }

  @Delete('profile-templates/:templateId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeProfileTemplate(@Param('templateId') templateId: string, @Query('key') key: string = 'default') {
    await this.dynamicConfigService.removeProfileTemplate(key, templateId);
  }
}
