import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskCommentDTO {
  
  @IsString()
  @IsNotEmpty()
  content : string;

  @IsNumber()
  @IsNotEmpty()
  taskId : number;

}