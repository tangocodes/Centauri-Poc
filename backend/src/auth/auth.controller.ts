import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/loginUsers.dto.js';
import { AuthService } from './auth.service.js';

@Controller('login')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
    @Post()
    async loginUser(@Body() body: LoginUserDto): Promise<Object> {

        console.log(body)

        const checkAuth = await this.authService.login(body);
        return checkAuth;   
    }
}
