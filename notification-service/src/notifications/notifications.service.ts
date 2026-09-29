import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity.js';
import { CreateNotificationDto } from './dto/create-notification.dto.js';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(createDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId: createDto.userId,
      taskId: createDto.taskId ?? null,
      message: createDto.message,
      isRead: false,
    });
    return this.notificationRepository.save(notification);
  }

  async findForUser(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneForUser(id: number, userId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async markAsRead(id: number, userId: number): Promise<Notification> {
    const notification = await this.findOneForUser(id, userId);
    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  async remove(id: number, userId: number): Promise<{ message: string; id: number }> {
    const notification = await this.findOneForUser(id, userId);
    await this.notificationRepository.remove(notification);
    return { message: 'Notification deleted successfully', id };
  }
}
