import { Link } from "react-router-dom";
import { ShoppingCart, LogOut } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import CartDropdown from "./CartDropdown";
import { useState } from "react";
import { useCart } from "../cart/CartContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { totalProducts } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="
  sticky top-0 z-50
  bg-white
  border-b-4 border-black
  px-6 py-4
  flex justify-between items-center
  shadow-[0_6px_0_0_#000]
"
    >
      <Link
        to="/"
        className="
      text-2xl font-extrabold
      text-black
      flex items-center gap-2
    "
      >
        <img
          src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
          alt="Pokemon"
          className="w-40"
        />
      </Link>

      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <>
            <button
              onClick={() => setOpen(!open)}
              className="
            relative
            bg-red-500
            border-4 border-black
            rounded-full
            p-3
            shadow-[3px_3px_0_0_#000]
            active:translate-x-1
            active:translate-y-1
            active:shadow-none
            cursor-pointer
          "
            >
              <ShoppingCart size={22} className="text-white" />

              {totalProducts > 0 && (
                <span
                  className="
              absolute -top-3 -right-3
              bg-yellow-400
              text-black
              text-xs font-extrabold
              px-2 py-0.5
              rounded-full
              border-2 border-black
            "
                >
                  {totalProducts}
                </span>
              )}
            </button>

            <CartDropdown open={open} onClose={() => setOpen(false)} />

            <button
              onClick={logout}
              className="
            flex items-center gap-2
            bg-blue-500
            text-white
            px-4 py-2
            rounded-xl
            border-4 border-black
            font-bold
            shadow-[3px_3px_0_0_#000]
            active:translate-x-1
            active:translate-y-1
            active:shadow-none
          "
            >
              <LogOut size={18} />
              Salir
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="
            bg-yellow-400
            px-4 py-2
            rounded-xl
            border-4 border-black
            font-bold
            shadow-[3px_3px_0_0_#000]
            hover:bg-yellow-300
          "
            >
              Ingresar
            </Link>

            <Link
              to="/register"
              className="
            bg-red-500
            text-white
            px-4 py-2
            rounded-xl
            border-4 border-black
            font-bold
            shadow-[3px_3px_0_0_#000]
            hover:bg-red-400
          "
            >
              Registrar
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
