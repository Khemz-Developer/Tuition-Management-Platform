import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PublicService } from './public.service';
import { Public } from '../decorators/public.decorator';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Public()
  @Get('teachers')
  async getTeachers() {
    return this.publicService.getTeachers();
  }

  @Public()
  @Get('teachers/:slug')
  async getTeacherProfile(@Param('slug') slug: string) {
    return this.publicService.getTeacherProfile(slug);
  }

  @Public()
  @Post('teachers/:slug/contact')
  async contactTeacher(@Param('slug') slug: string, @Body() body: any) {
    return this.publicService.contactTeacher(slug, body);
  }
}
