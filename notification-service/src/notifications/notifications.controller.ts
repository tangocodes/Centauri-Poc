import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { CreateNotificationDto } from './dto/create-notification.dto.js';
import { ServiceAuthGuard } from '../auth/guards/service-auth.guard.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Internal endpoint for services (e.g. Task API) to create a notification.
   * Protected with SERVICE_API_KEY.
   */
  @UseGuards(ServiceAuthGuard)
  @Post()
  async create(@Body() createDto: CreateNotificationDto) {
    return this.notificationsService.create(createDto);
  }

  /**
   * User endpoint to get their own notifications.
   * Protected with JWT auth; extracts user ID from token sub.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyNotifications(@Request() req: any) {
    const userId = Number(req.user.sub);
    return this.notificationsService.findForUser(userId);
  }

  /**
   * User endpoint to get a single notification belonging to them.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const userId = Number(req.user.sub);
    return this.notificationsService.findOneForUser(id, userId);
  }

  /**
   * User endpoint to mark a notification as read.
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const userId = Number(req.user.sub);
    return this.notificationsService.markAsRead(id, userId);
  }

  /**
   * User endpoint to delete a notification.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const userId = Number(req.user.sub);
    return this.notificationsService.remove(id, userId);
  }
}
