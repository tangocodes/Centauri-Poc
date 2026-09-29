import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SendNotificationPayload {
  userId: number;
  taskId?: number;
  message: string;
}

@Injectable()
export class NotificationsClientService {
  private readonly logger = new Logger(NotificationsClientService.name);
  private readonly serviceUrl: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.serviceUrl = this.configService.get<string>(
      'NOTIFICATION_SERVICE_URL',
      'http://localhost:3001',
    );
    this.apiKey = this.configService.get<string>(
      'NOTIFICATION_SERVICE_API_KEY',
      'centauri-internal-secret',
    );
  }

  async sendNotification(payload: SendNotificationPayload): Promise<void> {
    try {
      const url = `${this.serviceUrl}/notifications`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-service-api-key': this.apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.warn(
          `Failed to deliver notification to Notification Service. HTTP Status: ${response.status}. Response: ${errorText}`,
        );
      } else {
        this.logger.log(`Notification dispatched successfully for userId=${payload.userId}`);
      }
    } catch (error: any) {
      // Per requirements, notification failure must NOT break the task operation.
      this.logger.warn(
        `Error communicating with Notification Service: ${error?.message || error}`,
      );
    }
  }
}
