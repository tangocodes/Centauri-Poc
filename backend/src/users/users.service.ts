import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User)
    private readonly userRepository:
        Repository<User>
    ) { }

    async createUser(body: CreateUserDto): Promise<Object | undefined> {

        const checkUser = await this.userRepository.findOne({ where: { email: body.email } })

        if (checkUser) {
            throw new ConflictException("User already registered")
        }

        const passwordHash = await bcrypt.hash(body.password, 10);
        const userCreate = await this.userRepository.save({
            name: body.name,
            email: body.email,
            passwordHash: passwordHash
        });

        return { name: userCreate.name, id: userCreate.id, message: "User Created Succefully" }




    }


    async findUserByEmail(email: string): Promise<User | null> {

        return await this.userRepository.findOne({ where: { email } })
    }


    async getUserById(id: number) {

        const user = await this.userRepository.findOne({ where: { id: id } })

        if (user) {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                joinedAt: user.createdAt,
                department: "Product",
                role: "Full Stack Developer",
                bio: "Hey this is a static data will update"
            };
        }
        return user;

    }

}
