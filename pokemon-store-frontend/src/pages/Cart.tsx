import { useEffect, useState } from "react";
import api from "../api/axios";
import type { CartItem } from "../types/cart";

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    api.get("/cart/summary").then((res) => {
      setItems(res.data.items);
      setSubtotal(res.data.subtotal);
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.map((item) => (
        <div
          key={item.pokemonId}
          className="flex justify-between bg-slate-900 p-4 rounded mb-4"
        >
          <span className="capitalize">{item.name}</span>
          <span>
            {item.quantity} × ${item.price.toLocaleString("es-CO")}
          </span>
        </div>
      ))}

      <div className="text-right mt-6 text-xl font-bold">
        Total: ${subtotal.toLocaleString("es-CO")} COP
      </div>
    </div>
  );
}
