import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PokemonService } from '../pokemon/pokemon.service';
import { NotFoundException } from '@nestjs/common';
import { FileDB } from '../common/utils/file-db';

jest.mock('../common/utils/file-db');

describe('CartService', () => {
    let cartService: CartService;
    let pokemonService: jest.Mocked<PokemonService>;

    let mockRead: jest.Mock;
    let mockWrite: jest.Mock;

    beforeEach(async () => {
        mockRead = jest.fn();
        mockWrite = jest.fn();

        (FileDB as jest.Mock).mockImplementation(() => ({
            read: mockRead,
            write: mockWrite,
        }));

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CartService,
                {
                    provide: PokemonService,
                    useValue: {
                        getPokemonById: jest.fn(),
                    },
                },
            ],
        }).compile();

        cartService = module.get<CartService>(CartService);
        pokemonService = module.get(PokemonService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getCart', () => {
        it('debe retornar el carrito del usuario si existe', async () => {
            mockRead.mockResolvedValue([
                { userId: 'user1', items: [{ pokemonId: 1, quantity: 2 }] },
            ]);

            const result = await cartService.getCart('user1');

            expect(result.userId).toBe('user1');
            expect(result.items.length).toBe(1);
        });

        it('debe retornar un carrito vacío si no existe', async () => {
            mockRead.mockResolvedValue([]);

            const result = await cartService.getCart('user2');

            expect(result).toEqual({
                userId: 'user2',
                items: [],
            });
        });
    });

    describe('addToCart', () => {
        it('debe crear un carrito y agregar un item nuevo', async () => {
            mockRead.mockResolvedValue([]);

            pokemonService.getPokemonById.mockResolvedValue({
                id: 1,
                name: 'Pikachu',
                price: 10000,
            } as any);

            const result = await cartService.addToCart('user1', 1, 2);

            expect(result.items).toHaveLength(1);
            expect(result.items[0]).toMatchObject({
                pokemonId: 1,
                name: 'Pikachu',
                price: 10000,
                quantity: 2,
            });

            expect(mockWrite).toHaveBeenCalled();
        });

        it('debe incrementar la cantidad si el item ya existe', async () => {
            mockRead.mockResolvedValue([
                {
                    userId: 'user1',
                    items: [
                        { pokemonId: 1, name: 'Pikachu', price: 10000, quantity: 1 },
                    ],
                },
            ]);

            pokemonService.getPokemonById.mockResolvedValue({
                id: 1,
                name: 'Pikachu',
                price: 10000,
            } as any);

            const result = await cartService.addToCart('user1', 1, 3);

            expect(result.items[0].quantity).toBe(4);
        });
    });

    describe('removeFromCart', () => {
        it('debe eliminar un item del carrito', async () => {
            mockRead.mockResolvedValue([
                {
                    userId: 'user1',
                    items: [{ pokemonId: 1, quantity: 1 }],
                },
            ]);

            const result = await cartService.removeFromCart('user1', 1);

            expect(result.items).toHaveLength(0);
            expect(mockWrite).toHaveBeenCalled();
        });

        it('debe lanzar NotFoundException si el carrito no existe', async () => {
            mockRead.mockResolvedValue([]);

            await expect(
                cartService.removeFromCart('user1', 1),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('getCartSummary', () => {
        it('debe calcular correctamente el resumen', async () => {
            jest.spyOn(cartService, 'getCart').mockResolvedValue({
                userId: 'user1',
                items: [
                    { pokemonId: 1, name: 'Pikachu', price: 10000, quantity: 2 },
                    { pokemonId: 2, name: 'Bulbasaur', price: 8000, quantity: 1 },
                ],
            });

            const result = await cartService.getCartSummary('user1');

            expect(result.totalItems).toBe(3);
            expect(result.subtotal).toBe(28000);
            expect(result.currency).toBe('COP');
        });
    });
});
