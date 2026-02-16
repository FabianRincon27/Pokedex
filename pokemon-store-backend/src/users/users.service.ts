import { Injectable } from '@nestjs/common';
import { FileDB } from '../common/utils/file-db';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
    private db = new FileDB<User>('users.json');

    async findByEmail(email: string): Promise<User | undefined> {
        const users = await this.db.read();
        return users.find(user => user.email === email);
    }

    async create(user: User): Promise<void> {
        const users = await this.db.read();
        users.push(user);
        await this.db.write(users);
    }
}
