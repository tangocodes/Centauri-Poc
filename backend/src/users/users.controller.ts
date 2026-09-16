import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Controller('users')
export class UsersController {
    constructor( private readonly userService : UsersService){}

    @Post()
    createUser(@Body() body:CreateUserDto )
    {

        return this.userService.createUser(body);

    }
}
