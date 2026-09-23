  import { Injectable, NotFoundException, Patch } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Task } from './entities/task.entity.js';
  import { privateDecrypt } from 'crypto';
  import { Repository } from 'typeorm';
  import { UpdateTaskDto } from './dto/update-task.dto.js';
  import { User } from '../users/entities/user.entity.js';

  @Injectable()
  export class TasksService {

      constructor(
      @InjectRepository(Task) 
      private readonly taskRepository: Repository<Task>,
      @InjectRepository(User)
      private readonly userRepository : Repository<User>
  ){}

  async getAllTasks(): Promise<Task[]> {
      return this.taskRepository.find(
        {relations: {
    assignedToId: true,
    createdById : true
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
      createdById:createdBy
    });

    return this.taskRepository.save(task);
  }

  async updateTask(
    id : number,
    updates : UpdateTaskDto,
  ): Promise<Task> {

  let assignedTo: User | null = null;
  let createdBy: User | null = null;

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

    
    const task = await this.taskRepository.preload({id,...updates,assignedToId:assignedTo,createdById:createdBy});

    console.log(task);
    if(!task)
    {
      throw new NotFoundException(`We dont see any data with id : ${id}`)
    }
    
    return this.taskRepository.save(task);

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
