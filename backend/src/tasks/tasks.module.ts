import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity.js';
import { TasksService } from './tasks.service.js';
import { TasksController } from './tasks.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { User } from '../users/entities/user.entity.js';
import { NotificationsClientModule } from '../notifications-client/notifications-client.module.js';

@Module({
    imports:[
          TypeOrmModule.forFeature([Task,User]),
          AuthModule,
          NotificationsClientModule,
    ],
    providers: [TasksService],
    controllers: [TasksController],

    
})
export class TasksModule {
    
}

