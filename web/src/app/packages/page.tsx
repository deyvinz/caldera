import { get, type Package, type Paged } from "@/lib/api";
import { PackageCard } from "@/components/catalog/PackageCard";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const res = await get<Paged<Package>>("/catalog/packages", { next: { revalidate } });
  const items = res.ok ? res.data.items : [];
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl text-emerald-900 mb-6">Packages</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <PackageCard key={p.id} pkg={p} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}


