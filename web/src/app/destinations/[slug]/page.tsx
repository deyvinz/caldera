import { get, type Destination, type Package, type Paged } from "@/lib/api";
import { PackageCard } from "@/components/catalog/PackageCard";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function DestinationDetail(props: any) {
  const maybeParams = props?.params;
  const params = maybeParams && typeof maybeParams.then === "function" ? await maybeParams : maybeParams;
  const destRes = await get<{ item: Destination }>(`/catalog/destinations/${params.slug}`, { next: { revalidate } });
  const destination = destRes.ok ? destRes.data.item : undefined;
  const pkgsRes = destination ? await get<Paged<Package>>(`/catalog/packages?destinationId=${destination.id}`, { next: { revalidate } }) : { ok: false } as const;
  const items: Package[] = (pkgsRes as any).ok ? (pkgsRes as any).data.items : [];

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl text-emerald-900 mb-2">{destination?.name}</h1>
        <p className="text-charcoal-900/80 mb-8">{destination?.description}</p>
        <h2 className="font-serif text-2xl text-emerald-900 mb-4">Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p: Package) => (
            <PackageCard key={p.id} pkg={p} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}


