import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(email: string, password: string) {
        const hashed = await bcrypt.hash(password, 10);

        await this.usersService.create({
            id: randomUUID(),
            email,
            password: hashed,
        });

        return { message: 'Usuario registrado exitosamente.' };
    }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Credenciales invalidas');
        }

        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });

        return { access_token: token };
    }
}
