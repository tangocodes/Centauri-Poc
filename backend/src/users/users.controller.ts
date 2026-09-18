import { Body, Controller, Get, Headers, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';

@Controller('users')
export class UsersController {
    constructor( private readonly userService : UsersService
    ){}
    @Post()
    createUser(@Body() body:CreateUserDto )
    {

        return this.userService.createUser(body);
    }

   @UseGuards(JwtAuthGuard)
   @Get('me')
   getCurrentUser(@Request() req : any) {
  return this.userService.getUserById(req.user.sub)//sub means user id which is coming request set in authguard
     }     
}
