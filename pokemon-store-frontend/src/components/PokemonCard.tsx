import { motion } from "framer-motion";
import type { Pokemon } from "../types/pokemon";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../cart/CartContext";
import { CheckCircle, Plus } from "lucide-react";
import { getRandomColor } from "../utils/getRandomColor";
import toast from "react-hot-toast";

interface Props {
  pokemon: Pokemon;
  onClick: () => void;
}

export default function PokemonCard({ pokemon, onClick }: Props) {
  const { fetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const addToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    try {
      await api.post("/cart", {
        pokemonId: pokemon.id,
        quantity: 1,
      });

      fetchCart();

      toast.custom((t) => (
        <div
          className={`
            flex items-center gap-3
            bg-white
            border-4 border-black
            rounded-2xl
            px-4 py-3
            shadow-[4px_4px_0_0_#000]
            transition-all
            ${t.visible ? "animate-enter" : "animate-leave"}
          `}
        >
          <div
            className="
            bg-green-400
            p-2
            rounded-xl
            border-2 border-black
          "
          >
            <CheckCircle className="text-black" size={22} />
          </div>

          <div className="flex-1">
            <p className="font-extrabold text-black">¡Pokémon añadido!</p>
            <p className="text-sm text-zinc-600">
              Se añadió correctamente al carrito
            </p>
          </div>

          {/* Close */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-black font-bold"
          >
            ✕
          </button>
        </div>
      ));
    } catch (error) {
      toast.error("Error al añadir al carrito");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="
    relative
    bg-white
    rounded-2xl
    pt-14
    mt-10
    px-5
    h-56
    gap-6
    shadow-md
    hover:shadow-lg
    transition-all
    cursor-pointer
  "
      onClick={onClick}
    >
      <div className="absolute -top-10 left-1/2 -translate-x-1/2">
        <motion.img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-28 h-28 drop-shadow-2xl"
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <h3 className="mt-4 text-lg font-bold text-center capitalize text-zinc-900">
        {pokemon.name}
      </h3>

      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className={`
          px-3 py-1
          text-xs
          font-semibold
          rounded-full
          ${getRandomColor()}
        `}
          >
            {type}
          </span>
        ))}
      </div>

      <p className="mt-4 text-center text-lg font-semibold text-zinc-800">
        ${pokemon.price.toLocaleString("es-CO")} COP
      </p>

      <div className="w-full flex justify-end mt-1">
        {isAuthenticated && (
          <button
            onClick={addToCart}
            className="
      flex
      justify-end
      text-orange-500
      rounded-full
      border
      p-1
      border-orange-500
      cursor-pointer
      hover:bg-orange-500
      hover:text-white
    "
          >
            <Plus size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
