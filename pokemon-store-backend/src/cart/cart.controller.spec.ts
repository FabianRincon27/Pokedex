import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('CartController', () => {
    let controller: CartController;
    let cartService: jest.Mocked<CartService>;

    const mockUser = {
        userId: 'user-123',
        email: 'test@test.com',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CartController],
            providers: [
                {
                    provide: CartService,
                    useValue: {
                        getCart: jest.fn(),
                        addToCart: jest.fn(),
                        removeFromCart: jest.fn(),
                        getCartSummary: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: jest.fn(() => true),
            })
            .compile();

        controller = module.get<CartController>(CartController);
        cartService = module.get(CartService);
    });

    it('debe estar definido', () => {
        expect(controller).toBeDefined();
    });

    describe('getCart', () => {
        it('debe retornar el carrito del usuario', async () => {
            cartService.getCart.mockResolvedValue({
                userId: mockUser.userId,
                items: [],
            } as any);

            const result = await controller.getCart(mockUser as any);

            expect(cartService.getCart).toHaveBeenCalledWith(mockUser.userId);
            expect(result.items).toEqual([]);
        });
    });

    describe('addToCart', () => {
        it('debe agregar un item al carrito', async () => {
            cartService.addToCart.mockResolvedValue({
                userId: mockUser.userId,
                items: [{ pokemonId: 1, quantity: 2 }],
            } as any);

            const dto = {
                pokemonId: 1,
                quantity: 2,
            };

            const result = await controller.addToCart(
                mockUser as any,
                dto as any,
            );

            expect(cartService.addToCart).toHaveBeenCalledWith(
                mockUser.userId,
                dto.pokemonId,
                dto.quantity,
            );

            expect(result.items.length).toBe(1);
        });
    });

    describe('removeFromCart', () => {
        it('debe eliminar un item del carrito', async () => {
            cartService.removeFromCart.mockResolvedValue({
                userId: mockUser.userId,
                items: [],
            } as any);

            const result = await controller.removeFromCart(
                mockUser as any,
                '1',
            );

            expect(cartService.removeFromCart).toHaveBeenCalledWith(
                mockUser.userId,
                1,
            );

            expect(result.items).toHaveLength(0);
        });
    });

    describe('getSummary', () => {
        it('debe retornar el resumen del carrito', async () => {
            cartService.getCartSummary.mockResolvedValue({
                totalItems: 3,
                subtotal: 28000,
                currency: 'COP',
                items: [],
            });

            const result = await controller.getSummary(mockUser as any);

            expect(cartService.getCartSummary).toHaveBeenCalledWith(
                mockUser.userId,
            );

            expect(result.totalItems).toBe(3);
            expect(result.currency).toBe('COP');
        });
    });
});
