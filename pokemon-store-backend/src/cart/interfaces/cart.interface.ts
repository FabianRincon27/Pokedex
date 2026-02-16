export interface CartItem {
    pokemonId: number;
    name: string;
    price: number;
    quantity: number;
}

export interface Cart {
    userId: string;
    items: CartItem[];
}
