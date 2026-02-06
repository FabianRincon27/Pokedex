import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import type { Pokemon } from "../types/pokemon";
import { useCart } from "../cart/CartContext";
import { ShoppingCart } from "lucide-react";
import { getRandomColor } from "../utils/getRandomColor";
import PokemonDetailSkeleton from "../components/PokemonEskeleton";
import { useAuth } from "../auth/AuthContext";

export default function PokemonDetail() {
  const { id } = useParams();
  const { fetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    api.get(`/pokemon/${id}`).then((res) => setPokemon(res.data));
  }, [id]);

  const addToCart = async () => {
    if (!pokemon) return;

    await api.post("/cart", {
      pokemonId: pokemon.id,
      quantity: 1,
    });

    fetchCart();
  };

  if (!pokemon) return <PokemonDetailSkeleton />;

  return (
    <div className="min-h-screen px-4 py-10">
      <div
        className="
      max-w-6xl mx-auto
      bg-white
      border-4 border-black
      rounded-3xl
      shadow-[8px_8px_0_0_#000]
      p-4
    "
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <motion.img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-72 drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)]"
              animate={{
                y: [0, -16, 0],
                rotate: [0, 1.5, -1.5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold capitalize text-black">
              {pokemon.name}
            </h1>

            <div className="flex flex-wrap gap-2 mt-4">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`
                px-4 py-1.5
                text-sm
                font-extrabold
                rounded-full
                border-2 border-black
                shadow-[2px_2px_0_0_#000]
                ${getRandomColor()}
              `}
                >
                  {type}
                </span>
              ))}
            </div>

            <p className="mt-6 text-zinc-700 leading-relaxed text-lg">
              {pokemon.description}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <span className="text-xl font-bold text-zinc-500">Precio</span>
              <span
                className="
              text-2xl font-extrabold
              bg-yellow-400
              px-4 py-2
              text-yellow-700
              rounded-xl
              border-3 border-black
              shadow-[4px_4px_0_0_#000]
            "
              >
                ${pokemon.price.toLocaleString("es-CO")} COP
              </span>
            </div>

            {isAuthenticated && (
              <button
                onClick={addToCart}
                className="
            mt-6
            inline-flex
            items-center
            gap-3
            bg-red-500
            text-white
            px-4
            py-4
            rounded-2xl
            font-extrabold
            text-md
            border-4 border-black
            shadow-[4px_4px_0_0_#000]
            transition
            hover:bg-red-600
            active:translate-x-1
            active:translate-y-1
            active:shadow-none
            focus:outline-none
            cursor-pointer
          "
              >
                <ShoppingCart size={22} />
                Añadir al carrito
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
