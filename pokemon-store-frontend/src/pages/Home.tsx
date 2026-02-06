import { useEffect, useState } from "react";
import api from "../api/axios";
import PokemonCard from "../components/PokemonCard";
import PokemonSkeleton from "../components/PokemonSkeleton";
import { useNavigate } from "react-router-dom";
import type { Pokemon } from "../types/pokemon";

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    api.get("/pokemon").then((res) => {
      setPokemons(res.data);
      setLoading(false);
    });
  }, []);

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPokemons = filteredPokemons.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="min-h-scree">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-block bg-white border-4 border-black rounded-2xl px-6 py-4 shadow-[6px_6px_0_0_#000]">
            <h2 className="text-2xl font-extrabold text-black tracking-tight">
              Pokédex
            </h2>
            <p className="text-sm font-semibold text-zinc-700">
              Explora, descubre y conoce todos los Pokémon
            </p>
          </div>
        </header>

        <div className="mb-8 flex justify-center sm:justify-start">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Buscar Pokémon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
            w-full
            pl-12
            pr-4
            py-3
            rounded-2xl
            border-4
            border-black
            bg-yellow-100
            text-black
            font-bold
            placeholder-black/60
            shadow-[4px_4px_0_0_#000]
            focus:outline-none
            focus:bg-yellow-200
          "
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
              🔍
            </span>
          </div>
        </div>

        <section>
          <div
            className="
          grid 
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-5 
          xl:grid-cols-6  
          gap-6
        "
          >
            {loading
              ? Array.from({ length: 20 }).map((_, i) => (
                  <PokemonSkeleton key={i} />
                ))
              : paginatedPokemons.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    onClick={() => navigate(`/pokemon/${pokemon.id}`)}
                  />
                ))}
          </div>
        </section>

        {!loading && totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="
            px-6 py-3
            rounded-xl
            border-4
            border-black
            text-black
            cursor-pointer
            bg-white
            font-bold
            shadow-[4px_4px_0_0_#000]
            disabled:opacity-50
            disabled:shadow-none
            disabled:translate-x-0
            active:translate-x-1
            active:translate-y-1
            active:shadow-none
          "
            >
              ◀ Anterior
            </button>

            <span className="px-4 py-2 font-extrabold text-black text-lg">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="
            px-6 py-3
            rounded-xl
            border-4
            border-black
            bg-white
            text-black
            font-bold
            cursor-pointer
            shadow-[4px_4px_0_0_#000]
            disabled:opacity-50
            disabled:shadow-none
            active:translate-x-1
            active:translate-y-1
            active:shadow-none
          "
            >
              Siguiente ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
