import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { FileDB } from '../common/utils/file-db';
import { User } from './interfaces/user.interface';

jest.mock('../common/utils/file-db');

describe('UsersService', () => {
    let service: UsersService;
    let fileDbMock: jest.Mocked<FileDB<User>>;

    const mockUsers: User[] = [
        {
            id: '1',
            email: 'test@test.com',
            password: 'hashed-password',
        },
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService],
        }).compile();

        service = module.get<UsersService>(UsersService);

        fileDbMock = (service as any).db;

        jest.clearAllMocks();
    });

    describe('findByEmail', () => {
        it('debe retornar el usuario si existe', async () => {
            fileDbMock.read.mockResolvedValue(mockUsers);

            const result = await service.findByEmail('test@test.com');

            expect(result).toEqual(mockUsers[0]);
            expect(fileDbMock.read).toHaveBeenCalledTimes(1);
        });

        it('debe retornar undefined si no existe', async () => {
            fileDbMock.read.mockResolvedValue(mockUsers);

            const result = await service.findByEmail('no-existe@test.com');

            expect(result).toBeUndefined();
        });
    });

    describe('create', () => {
        it('debe agregar un usuario y guardarlo', async () => {
            const newUser: User = {
                id: '2',
                email: 'new@test.com',
                password: 'hashed-pass',
            };

            fileDbMock.read.mockResolvedValue([...mockUsers]);
            fileDbMock.write.mockResolvedValue(undefined);

            await service.create(newUser);

            expect(fileDbMock.read).toHaveBeenCalledTimes(1);
            expect(fileDbMock.write).toHaveBeenCalledTimes(1);

            const writtenUsers = fileDbMock.write.mock.calls[0][0];
            expect(writtenUsers).toHaveLength(2);
            expect(writtenUsers[1]).toEqual(newUser);
        });
    });
});
