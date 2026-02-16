import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: jest.Mocked<AuthService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        register: jest.fn(),
                        login: jest.fn(),
                    },
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get(AuthService);
    });

    it('debe estar definido', () => {
        expect(authController).toBeDefined();
    });

    describe('register', () => {
        it('debe llamar a authService.register y retornar su resultado', async () => {
            authService.register.mockResolvedValue({
                message: 'Usuario registrado exitosamente.',
            });

            const dto = {
                email: 'test@test.com',
                password: '123456',
            };

            const result = await authController.register(dto as any);

            expect(authService.register).toHaveBeenCalledWith(
                dto.email,
                dto.password,
            );

            expect(result).toEqual({
                message: 'Usuario registrado exitosamente.',
            });
        });
    });

    describe('login', () => {
        it('debe llamar a authService.login y retornar el token', async () => {
            authService.login.mockResolvedValue({
                access_token: 'fake-token',
            });

            const dto = {
                email: 'test@test.com',
                password: '123456',
            };

            const result = await authController.login(dto as any);

            expect(authService.login).toHaveBeenCalledWith(
                dto.email,
                dto.password,
            );

            expect(result).toEqual({
                access_token: 'fake-token',
            });
        });
    });
});
