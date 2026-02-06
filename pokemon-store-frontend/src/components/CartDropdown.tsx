import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useCart } from "../cart/CartContext";
import { useEffect, useRef } from "react";
import { Trash } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDropdown({ open, onClose }: Props) {
  const { items, fetchCart } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const removeItem = async (pokemonId: number) => {
    await api.delete(`/cart/${pokemonId}`);
    fetchCart();
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="
        absolute right-5 top-24
        w-80
        bg-white
        border-4 border-black
        rounded-2xl
        p-4
        shadow-[6px_6px_0_0_#000]
        z-50
      "
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-lg text-black">🧢 Tu equipo</h3>
            <span className="text-xs bg-yellow-400 px-2 py-1 rounded-full border-2 text-yellow-700 border-black font-bold">
              {items.length}
            </span>
          </div>

          {items.length === 0 && (
            <div className="text-center py-6">
              <p className="font-semibold text-zinc-500">
                No tienes Pokémon aún
              </p>
            </div>
          )}

          <div className="space-y-3 max-h-60 overflow-auto pr-1">
            {items.map((item) => (
              <div
                key={item.pokemonId}
                className="
              flex justify-between items-center
              bg-zinc-100
              px-3 py-2
              rounded-xl
              border-2 border-black
            "
              >
                <span className="capitalize font-semibold text-sm text-black">
                  {item.name}{" "}
                  <span className="text-zinc-500">x {item.quantity}</span>
                </span>

                <button
                  onClick={() => removeItem(item.pokemonId)}
                  className="
                bg-red-500
                text-white
                cursor-pointer
                p-2
                rounded-lg
                border-2 border-black
                shadow-[2px_2px_0_0_#000]
                active:translate-x-0.5
                active:translate-y-0.5
                active:shadow-none
              "
                >
                  <Trash size={14} />
                </button>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <div
              className="
          mt-4
          pt-4
          border-t-4 border-black
          flex justify-between items-center
        "
            >
              <span className="font-bold text-black">Total</span>
              <span
                className="
            bg-blue-500
            text-white
            px-3 py-1
            rounded-xl
            border-2 border-black
            font-extrabold
          "
              >
                ${total.toLocaleString("es-CO")} COP
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
