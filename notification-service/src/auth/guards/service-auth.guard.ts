import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServiceAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-service-api-key'] || request.headers['x-service-key'];
    const expectedKey = this.configService.get<string>('SERVICE_API_KEY');

    if (!expectedKey) {
      // If no key configured, reject by default for security
      throw new UnauthorizedException('SERVICE_API_KEY is not configured on the server');
    }

    if (!apiKey || apiKey !== expectedKey) {
      throw new UnauthorizedException('Invalid or missing service API key');
    }

    return true;
  }
}
