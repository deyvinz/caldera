import { get, type Package } from "@/lib/api";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Badge } from "@/components/ui/badge";
import { formatUSD } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CompositionList } from "@/components/catalog/CompositionList";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function PackageDetail(props: any) {
  const maybeParams = props?.params;
  const params = maybeParams && typeof maybeParams.then === "function" ? await maybeParams : maybeParams;
  const res = await get<{ item: Package }>(`/catalog/packages/${params.slug}`, { next: { revalidate } });
  const item = res.ok ? res.data.item : undefined;
  const compRes = item ? await get<{ items: { partnerName: string; service: string }[] }>(`/catalog/packages/${item.id}/composition`, { next: { revalidate } }) : { ok: false } as const;
  const composition = (compRes as any).ok ? (compRes as any).data.items : [];

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        <h1 className="font-serif text-3xl text-emerald-900">{item?.title}</h1>
        <div className="flex items-center gap-3 text-sm">
          <span>{item?.durationDays} days</span>
          {item?.luxury && <Badge>Luxury</Badge>}
        </div>
        <div className="text-2xl font-semibold text-emerald-900">{item ? formatUSD(item.priceUsd) : null}</div>
        <div className="space-y-8">
          <a href={`/checkout/${item?.id}`} className="underline text-emerald-900">Book Now →</a>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="text-charcoal-900/80">{item?.category}</p>
              <h3 className="font-serif text-xl mt-6 mb-2">Composition</h3>
              <CompositionList items={composition} />
            </TabsContent>
            <TabsContent value="itinerary">
              <p className="text-charcoal-900/80">Detailed itinerary will be provided after booking.</p>
            </TabsContent>
            <TabsContent value="reviews">
              <p className="text-charcoal-900/80">Reviews coming soon.</p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}


