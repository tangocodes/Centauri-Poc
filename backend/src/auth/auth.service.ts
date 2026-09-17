import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/loginUsers.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
        constructor( private readonly userService : UsersService, private readonly jwtService : JwtService){}

    async login(body : LoginUserDto) : Promise<Object>
    {

        const user = await this.userService.findUserByEmail(body.email)

        if(user)
        {
            const verify = await bcrypt.compare(body.password,user.passwordHash)

            if(verify)  
            {
            const payload= {email:user.email,sub: user.id}
            const access_token =  this.jwtService.sign(payload)
            return {
                access_token : access_token
            };
            }

        }
        throw new UnauthorizedException('Invalid email or password')    }


    
}
