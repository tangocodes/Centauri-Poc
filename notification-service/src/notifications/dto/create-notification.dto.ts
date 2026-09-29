import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsOptional()
  @IsInt()
  taskId?: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
