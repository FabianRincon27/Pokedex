import { Injectable, NotFoundException } from '@nestjs/common';
import { FileDB } from '../common/utils/file-db';
import { Cart, CartItem } from './interfaces/cart.interface';
import { PokemonService } from '../pokemon/pokemon.service';

@Injectable()
export class CartService {
    private db = new FileDB<Cart>('carts.json');

    constructor(private readonly pokemonService: PokemonService) { }

    async getCart(userId: string): Promise<Cart> {
        const carts = await this.db.read();
        return carts.find(cart => cart.userId === userId) || {
            userId,
            items: [],
        };
    }

    async addToCart(userId: string, pokemonId: number, quantity = 1): Promise<Cart> {
        const carts = await this.db.read();
        let cart = carts.find(c => c.userId === userId);

        if (!cart) {
            cart = { userId, items: [] };
            carts.push(cart);
        }

        const pokemon = await this.pokemonService.getPokemonById(pokemonId);

        const item = cart.items.find(i => i.pokemonId === pokemonId);

        if (item) {
            item.quantity += quantity;
        } else {
            cart.items.push({
                pokemonId,
                name: pokemon.name,
                price: pokemon.price,
                quantity,
            });
        }

        await this.db.write(carts);
        return cart;
    }

    async removeFromCart(userId: string, pokemonId: number): Promise<Cart> {
        const carts = await this.db.read();
        const cart = carts.find(c => c.userId === userId);

        if (!cart) {
            throw new NotFoundException('Carrito no encontrado');
        }

        cart.items = cart.items.filter(item => item.pokemonId !== pokemonId);
        await this.db.write(carts);

        return cart;
    }

    async getCartSummary(userId: string) {
        const cart = await this.getCart(userId);

        const totalItems = cart.items.reduce(
            (sum, item) => sum + item.quantity,
            0,
        );

        const subtotal = cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );

        return {
            totalItems,
            subtotal,
            currency: 'COP',
            items: cart.items,
        };
    }

}
