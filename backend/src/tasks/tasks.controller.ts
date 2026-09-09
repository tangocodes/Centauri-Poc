import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { TasksService } from './tasks.service.js';
import { Task } from './entities/task.entity.js';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Post()
  createTask(
    @Body() body: {
  title: string;
  description: string;
  status: string;
  priority: string;
}
  ) {
    return this.tasksService.createTask(
    body.title,
    body.description,
    body.status,
    body.priority,
    );
  }

  @Get(':id')
  getTaskById(@Param('id') id: number)
  {
    return this.tasksService.getTasksById(Number(id));
  }

  @Patch(':id')
  updateTaskById(@Param('id') id : number , @Body() body: Task)
  {
     return this.tasksService.updateTask(Number(id),body);
  }

  @Delete(':id')
  deleteById(@Param('id') id: number){
    return this.tasksService.deleteTaskById(Number(id))
  }





}
