import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: jest.Mocked<UsersService>;
    let jwtService: jest.Mocked<JwtService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        create: jest.fn(),
                        findByEmail: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get(UsersService);
        jwtService = module.get(JwtService);
    });

    describe('register', () => {
        it('debe registrar un usuario correctamente', async () => {
            usersService.create.mockResolvedValue(undefined);

            const result = await authService.register(
                'test@test.com',
                '123456',
            );

            expect(usersService.create).toHaveBeenCalled();
            expect(result).toEqual({
                message: 'Usuario registrado exitosamente.',
            });
        });
    });

    describe('login', () => {
        it('debe retornar un token si las credenciales son válidas', async () => {
            const hashedPassword = await bcrypt.hash('123456', 10);

            usersService.findByEmail.mockResolvedValue({
                id: '1',
                email: 'test@test.com',
                password: hashedPassword,
            } as any);

            jwtService.sign.mockReturnValue('fake-jwt-token');

            const result = await authService.login(
                'test@test.com',
                '123456',
            );

            expect(result).toEqual({
                access_token: 'fake-jwt-token',
            });
        });

        it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
            usersService.findByEmail.mockResolvedValue(undefined);

            await expect(
                authService.login('test@test.com', '123456'),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
            usersService.findByEmail.mockResolvedValue({
                id: '1',
                email: 'test@test.com',
                password: await bcrypt.hash('otra', 10),
            } as any);

            await expect(
                authService.login('test@test.com', '123456'),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
});
