import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('messaging')
@UseGuards(JwtAuthGuard)
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('conversations')
  async getConversations(@CurrentUser() user: any) {
    return this.messagingService.getConversations(user.id);
  }

  @Post('messages')
  async sendMessage(@CurrentUser() user: any, @Body() body: any) {
    return this.messagingService.sendMessage(user.id, body);
  }
}
