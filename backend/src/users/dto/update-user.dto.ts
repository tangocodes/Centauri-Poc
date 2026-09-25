import { IsEmail, IsNotEmpty, IsOptional, isString, IsString } from 'class-validator';

export class updateUserDTO {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  department? : string;

  @IsOptional()
  role?: string;

  @IsOptional()
  bio?: string;

}