import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from '../models/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async getNotifications(userId: string) {
    const notifications = await this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    return { notifications };
  }

  async markAsRead(id: string) {
    const notification = await this.notificationModel.findById(id);
    if (notification) {
      notification.read = true;
      notification.readAt = new Date();
      await notification.save();
    }
    return { message: 'Notification marked as read' };
  }
}
