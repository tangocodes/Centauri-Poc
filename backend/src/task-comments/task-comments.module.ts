import { Module } from '@nestjs/common';
import { TaskCommentsController } from './task-comments.controller.js';
import { TaskCommentsService } from './task-comments.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskComment } from './entities/task-comment.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { Task } from '../tasks/entities/task.entity.js';
import { User } from '../users/entities/user.entity.js';

@Module({

  imports :[
              TypeOrmModule.forFeature([TaskComment,Task,User]),
              AuthModule
  ],
  controllers: [TaskCommentsController],
  providers: [TaskCommentsService]
})
export class TaskCommentsModule {}
