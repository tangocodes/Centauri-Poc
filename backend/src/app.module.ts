import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres_dev',
      database: 'centauri_tasks',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TasksModule // For DB connection
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

