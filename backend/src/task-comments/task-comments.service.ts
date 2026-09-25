import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../tasks/entities/task.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Repository } from 'typeorm';
import { TaskComment } from './entities/task-comment.entity.js';
import { CreateTaskCommentDTO } from './dto/create-task-comment.dto.js';

@Injectable()
export class TaskCommentsService {

    constructor(
          @InjectRepository(TaskComment)
          private readonly taskCommentsRepository : Repository<TaskComment>,
          @InjectRepository(Task) 
          private readonly taskRepository: Repository<Task>,
          @InjectRepository(User)
          private readonly userRepository : Repository<User>
      ){}


      async addNewComment(userId:number , body : CreateTaskCommentDTO) : Promise<TaskComment>
      {
                
        
           
             const task = await this.taskRepository.findOne({
                where: { id: body.taskId },
              });
        
              if (!task) {
                throw new NotFoundException(
                  `Task with id ${body.taskId} not found`,
                );
              }
            

        
        
            const user = await this.userRepository.findOne({
                where: { id: userId },
              });
        
              if (!user) {
                throw new NotFoundException(
                  `User with id ${userId} not found`,
                );
              }
            

        const taskComment = this.taskCommentsRepository.create({
            content : body.content,
            task : task,
            author : user,
        })


        return await this.taskCommentsRepository.save(taskComment)
         

      }


      async getTaskComments(taskId : number)
      {
       
          return this.taskCommentsRepository.find({
            where :{
                task : {
                    id : taskId
                }
            },
            relations :{
                task : true,
                author : true
            }
          })


      }
}
