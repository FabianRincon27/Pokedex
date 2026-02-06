import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./auth/AuthContext";
import { CartProvider } from "./cart/CartContext";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2500,
          }}
        />
        <AppRouter />
      </CartProvider>
    </AuthProvider>
  );
}
