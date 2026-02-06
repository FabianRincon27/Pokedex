export default function PokemonDetailSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-10 animate-pulse">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <div className="w-72 h-72 rounded-full bg-zinc-200" />
          </div>

          <div>
            <div className="h-10 w-3/4 bg-zinc-200 rounded-lg" />

            <div className="flex gap-2 mt-4">
              <div className="h-6 w-16 bg-zinc-200 rounded-full" />
              <div className="h-6 w-20 bg-zinc-200 rounded-full" />
              <div className="h-6 w-14 bg-zinc-200 rounded-full" />
            </div>

            <div className="mt-6 space-y-3">
              <div className="h-4 w-full bg-zinc-200 rounded" />
              <div className="h-4 w-11/12 bg-zinc-200 rounded" />
              <div className="h-4 w-10/12 bg-zinc-200 rounded" />
            </div>

            <div className="mt-6 h-8 w-40 bg-zinc-200 rounded-lg" />

            <div className="mt-8 h-12 w-56 bg-zinc-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
