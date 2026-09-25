import { Body, Controller, Get, Headers, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { updateUserDTO } from './dto/update-user.dto.js';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService
    ) { }
    @Post()
    createUser(@Body() body: CreateUserDto) {

        return this.userService.createUser(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getCurrentUser(@Request() req: any) {
        return this.userService.getUserById(req.user.sub)//sub means user id which is coming request set in authguard
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllUsers()
    {
        return this.userService.getAllUsers()
    }



    @UseGuards(JwtAuthGuard)
    @Patch('me')
    updateUserDetails(@Request() req : any,@Body() body : updateUserDTO)
    {
        return this.userService.updateUserDetails(body,req.user.sub)
    }


}
