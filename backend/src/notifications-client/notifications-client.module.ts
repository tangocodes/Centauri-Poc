import { Module } from '@nestjs/common';
import { NotificationsClientService } from './notifications-client.service.js';

@Module({
  providers: [NotificationsClientService],
  exports: [NotificationsClientService],
})
export class NotificationsClientModule {}
