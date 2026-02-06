import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import type { CartItem } from "../types/cart";

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalProducts: number;
  fetchCart: () => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart/summary");
      setItems(res.data.items);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalProducts = items.length;

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalProducts, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
