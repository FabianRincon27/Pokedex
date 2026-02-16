import { CartItem } from './cart.interface';

export interface CartSummary {
    totalItems: number;
    subtotal: number;
    currency: 'COP';
    items: CartItem[];
}
