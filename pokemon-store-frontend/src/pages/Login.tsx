import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { XCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.access_token);
      navigate("/");
    } catch (error) {
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
              bg-red-500
              p-2
              rounded-xl
              border-2 border-black
            "
          >
            <XCircle className="text-white" size={22} />
          </div>

          <div className="flex-1">
            <p className="font-extrabold text-black">Error de autenticación</p>
            <p className="text-sm text-zinc-600">
              Email o contraseña incorrectos
            </p>
          </div>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="font-bold text-black"
          >
            ✕
          </button>
        </div>
      ));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-500 via-yellow-400 to-blue-500 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-md
          bg-white
          rounded-3xl
          border-4
          border-black
          shadow-[8px_8px_0_0_#000]
          p-8
          space-y-6
        "
      >
        <div className="flex justify-center">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
            alt="Pokemon"
            className="w-40"
          />
        </div>

        <h2 className="text-2xl font-extrabold text-center text-black">
          Entrenador, inicia sesión
        </h2>

        <div>
          <label className="block text-sm font-bold text-black mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="ash@pokemon.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full
              px-4
              py-3
              rounded-xl
              border-4
              border-black
              bg-yellow-100
              text-black
              font-semibold
              placeholder-black/50
              focus:outline-none
              focus:bg-yellow-200
            "
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-black mb-1">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              px-4
              py-3
              rounded-xl
              border-4
              border-black
              bg-blue-100
              text-black
              font-semibold
              placeholder-black/50
              focus:outline-none
              focus:bg-blue-200
            "
          />
        </div>

        <button
          type="submit"
          className="
            w-full
            relative
            py-4
            rounded-full
            bg-red-500
            border-4
            border-black
            text-white
            text-lg
            font-extrabold
            shadow-[4px_4px_0_0_#000]
            transition
            active:translate-x-1
            active:translate-y-1
            active:shadow-none
          "
        >
          ¡A combatir!
        </button>
        <p className="mt-6 text-center text-sm text-zinc-600">
          ¿Aún no tienes cuenta?{" "}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Registrate
          </Link>
        </p>
      </form>
    </div>
  );
}
