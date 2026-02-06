import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-red-500 via-yellow-400 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
