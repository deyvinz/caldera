import { get, type Destination, type Paged } from "@/lib/api";
import { DestinationCard } from "@/components/catalog/DestinationCard";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const res = await get<Paged<Destination>>("/catalog/destinations", { next: { revalidate } });
  const items = res.ok ? res.data.items : [];
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl text-emerald-900 mb-6">Destinations</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}


