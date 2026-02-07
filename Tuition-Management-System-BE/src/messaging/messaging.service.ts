import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, ConversationDocument } from '../models/conversation.schema';
import { Message, MessageDocument } from '../models/message.schema';

@Injectable()
export class MessagingService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async getConversations(userId: string) {
    const conversations = await this.conversationModel.find({
      participants: userId,
    });
    return { conversations };
  }

  async sendMessage(userId: string, body: any) {
    const message = new this.messageModel({
      conversationId: body.conversationId,
      senderId: userId,
      text: body.text,
    });
    await message.save();
    return { message };
  }
}
