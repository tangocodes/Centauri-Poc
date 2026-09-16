import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard.js';

@Module({
  providers: [AuthService,JwtAuthGuard],
  controllers: [AuthController],
  imports:[UsersModule, JwtModule.register({
  secret: 'centauri-secret',
  signOptions: {
    expiresIn: '1h',
  }
})],
exports :[JwtModule,JwtAuthGuard]

})
export class AuthModule {}
