import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

import { TasksModule } from './tasks/tasks.module.js'
import { UsersModule } from './users/users.module.js'
import { AuthModule } from './auth/auth.module.js'
import { TaskCommentsModule } from './task-comments/task-comments.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),// Using env values config service to take env values
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    UsersModule,
    AuthModule,
    TasksModule,
    TaskCommentsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}