import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
// import { Task } from './entities/task.entity.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createTask(
    @Body() body : CreateTaskDto,
    @Request() req : any,
  ) {
    return this.tasksService.createTask(
    body.title,
    body.description,
    body.status,
    body.priority,
    body.assignedToId,
    req.user.sub
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getTaskById(@Param('id') id: number)
  {
    return this.tasksService.getTasksById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateTaskById(@Param('id') id : number , @Body() body: UpdateTaskDto)
  {
     return this.tasksService.updateTask(Number(id),body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteById(@Param('id') id: number){
    return this.tasksService.deleteTaskById(Number(id))
  }





}
