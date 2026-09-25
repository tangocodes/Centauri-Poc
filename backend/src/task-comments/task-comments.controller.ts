import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { TaskCommentsService } from './task-comments.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { TaskComment } from './entities/task-comment.entity.js';
import { CreateTaskCommentDTO } from './dto/create-task-comment.dto.js';

@Controller('task-comments')
export class TaskCommentsController {
    constructor(private readonly taskCommentService: TaskCommentsService) {}

    @UseGuards(JwtAuthGuard)
@Get(':taskId')
getTaskComments(@Param('taskId', ParseIntPipe) taskId: number) {
  return this.taskCommentService.getTaskComments(taskId);
}

    @UseGuards(JwtAuthGuard)
    @Post()
    addNewComment(@Request() req: any,@Body() body : CreateTaskCommentDTO)
    {
        return this.taskCommentService.addNewComment(req.user.sub,body)
    }


    
    

}
