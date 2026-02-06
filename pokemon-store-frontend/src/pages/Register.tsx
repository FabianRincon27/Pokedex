import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.custom((t) => (
        <div
          className={`
            flex items-center gap-3
            bg-white
            border-4 border-black
            rounded-2xl
            px-4 py-3
            shadow-[4px_4px_0_0_#000]
            ${t.visible ? "animate-enter" : "animate-leave"}
          `}
        >
          <div className="bg-red-500 p-2 rounded-xl border-2 border-black">
            <XCircle className="text-white" size={22} />
          </div>

          <div className="flex-1">
            <p className="font-extrabold text-black">Datos incompletos</p>
            <p className="text-sm text-zinc-600">Ingresa email y contraseña</p>
          </div>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="font-bold text-black"
          >
            ✕
          </button>
        </div>
      ));
      return;
    }

    try {
      await api.post("/auth/register", { email, password });

      toast.custom((t) => (
        <div
          className={`
            flex items-center gap-3
            bg-white
            border-4 border-black
            rounded-2xl
            px-4 py-3
            shadow-[4px_4px_0_0_#000]
            ${t.visible ? "animate-enter" : "animate-leave"}
          `}
        >
          <div className="bg-green-400 p-2 rounded-xl border-2 border-black">
            <CheckCircle className="text-black" size={22} />
          </div>

          <div className="flex-1">
            <p className="font-extrabold text-black">¡Cuenta creada!</p>
            <p className="text-sm text-zinc-600">Ya puedes iniciar sesión</p>
          </div>
        </div>
      ));

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error("Error al registrar usuario");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-500 via-yellow-400 to-blue-500 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md
          bg-white
          border-4 border-black
          rounded-3xl
          shadow-[8px_8px_0_0_#000]
          p-8
        "
      >
        <div className="flex justify-center mb-6">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
            alt="Pokemon"
            className="w-40"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-center mb-6 text-black">
          Crear cuenta
        </h2>

        <div className="mb-4">
          <label className="block mb-1 font-bold text-black">Email</label>
          <input
            className="
              w-full
              px-4 py-2.5
              rounded-xl
              border-3 border-black
              bg-zinc-100
              focus:outline-none
              focus:ring-2
              focus:ring-blue-400
            "
            placeholder="entrenador@pokemon.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-bold text-black">Contraseña</label>
          <input
            type="password"
            className="
              w-full
              px-4 py-2.5
              rounded-xl
              border-3 border-black
              bg-zinc-100
              focus:outline-none
              focus:ring-2
              focus:ring-red-400
            "
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="
            w-full
            bg-yellow-400
            text-black
            py-3
            rounded-2xl
            font-extrabold
            text-lg
            border-4 border-black
            shadow-[4px_4px_0_0_#000]
            transition
            hover:bg-yellow-300
            active:translate-x-1
            active:translate-y-1
            active:shadow-none
          "
        >
          Registrarse
        </button>

        <p className="mt-6 text-center text-sm text-zinc-600">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
