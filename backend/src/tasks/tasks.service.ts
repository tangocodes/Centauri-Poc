  import { Injectable, NotFoundException, Patch } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Task } from './entities/task.entity.js';
  import { privateDecrypt } from 'crypto';
  import { Repository } from 'typeorm';
  import { UpdateTaskDto } from './dto/update-task.dto.js';
  import { User } from '../users/entities/user.entity.js';
  import { NotificationsClientService } from '../notifications-client/notifications-client.service.js';

  @Injectable()
  export class TasksService {

      constructor(
      @InjectRepository(Task) 
      private readonly taskRepository: Repository<Task>,
      @InjectRepository(User)
      private readonly userRepository : Repository<User>,
      private readonly notificationsClientService: NotificationsClientService,
  ){}

  async getAllTasks(): Promise<Task[]> {
      return this.taskRepository.find(
        {relations: {
    assignedToId: true,
    createdById : true,
    lastUpdatedBy:true
  },}
      );
    }

    async getTasksById(id : number): Promise<Task | null> {
      const task = await this.taskRepository.findOne({
        where : {id}
      });
      if(!task)
      {
        throw new NotFoundException(`Task with ${id} not exist`)
      }
      return task;
    }

    async createTask(
    title: string,
    description: string,
    status: string,
    priority: string,
    assignedToId? : number | null,
    createdById? : number | null

  ): Promise<Task> {
    let createdBy: User | null = null;

    let assignedTo: User | null = null;
  console.log(createdById)
    if (createdById) {
      createdBy = await this.userRepository.findOne({
        where: { id: createdById },
      });

      if (!createdBy) {
        throw new NotFoundException(
          `User with id ${createdById} not found`,
        );
      }
    }

    if (assignedToId) {
      assignedTo = await this.userRepository.findOne({
        where: { id: assignedToId },
      });

      if (!assignedTo) {
        throw new NotFoundException(
          `User with id ${assignedToId} not found`,
        );
      }
    }
    console.log(createdBy)
    const task = this.taskRepository.create({
      title,
      description,
      status,
      priority,
      assignedToId:assignedTo,
      createdById:createdBy,
      lastUpdatedBy : createdBy
    });

    const savedTask = await this.taskRepository.save(task);

    // If assigned to a user, trigger notification asynchronously without blocking/failing task creation
    if (assignedTo) {
      void this.notificationsClientService.sendNotification({
        userId: assignedTo.id,
        taskId: savedTask.id,
        message: `New task assigned to you: ${savedTask.title}`,
      });
    }

    return savedTask;
  }

  async updateTask(
    id : number,
    updates : UpdateTaskDto,
  ): Promise<Task> {

  let assignedTo: User | null = null;
  let createdBy: User | null = null;
  let lastUpdatedBy : User | null = null;

   if (updates.createdById) {
      createdBy = await this.userRepository.findOne({
        where: { id: updates.createdById },
      });

      if (!createdBy) {
        throw new NotFoundException(
          `User with id ${updates.createdById} not found`,
        );
      }
    }

    if (updates.assignedToId) {
      assignedTo = await this.userRepository.findOne({
        where: { id: updates.assignedToId },
      });

      if (!assignedTo) {
        throw new NotFoundException(
          `User with id ${updates.assignedToId} not found`,
        );
      }
    }

    if (updates.lastUpdatedById) {
      lastUpdatedBy = await this.userRepository.findOne({
        where: { id: updates.lastUpdatedById },
      });

      if (!assignedTo) {
        throw new NotFoundException(
          `User with id ${updates.lastUpdatedById} not found`,
        );
      }
    }



    
    const task = await this.taskRepository.preload({id,...updates,assignedToId:assignedTo,createdById:createdBy,lastUpdatedBy:lastUpdatedBy});

    console.log(task);
    if(!task)
    {
      throw new NotFoundException(`We dont see any data with id : ${id}`)
    }
    
    const updatedTask = await this.taskRepository.save(task);

    // If task was assigned/re-assigned to a user, dispatch notification
    if (assignedTo) {
      void this.notificationsClientService.sendNotification({
        userId: assignedTo.id,
        taskId: updatedTask.id,
        message: `Task assigned to you: ${updatedTask.title}`,
      });
    }

    return updatedTask;

  }

  async deleteTaskById(id: number): Promise<Task>
  {
    const task = await this.taskRepository.findOne({where : {id}});

    if(!task)
    {
          throw new NotFoundException(`We dont see any data with id : ${id}`)

    }
    return this.taskRepository.remove(task);

  }
      
  }

