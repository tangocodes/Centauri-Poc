import { Injectable, NotFoundException, Patch } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity.js';
import { privateDecrypt } from 'crypto';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {

    constructor(@InjectRepository(Task) 
    private readonly taskRepository: Repository<Task>,
){}

 async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
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
): Promise<Task> {
  const task = this.taskRepository.create({
    title,
    description,
    status,
    priority,
  });

  return this.taskRepository.save(task);
}

async updateTask(
  id : number,
  updates : Partial<Task>,
): Promise<Task> {

  console.log(id)
  const task = await this.taskRepository.preload({id,...updates});

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
