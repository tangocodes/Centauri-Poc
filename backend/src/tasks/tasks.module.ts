import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity.js';
import { TasksService } from './tasks.service.js';
import { TasksController } from './tasks.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
    imports:[
          TypeOrmModule.forFeature([Task]),
          AuthModule
    ],
    providers: [TasksService],
    controllers: [TasksController],
    
})
export class TasksModule {
    
}
