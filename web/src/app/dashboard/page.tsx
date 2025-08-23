"use client";
import * as React from "react";
import useSWR from "swr";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { get } from "@/lib/api";
import { QRPass } from "@/components/booking/QRPass";

export const dynamic = "force-dynamic";

const fetcher = (path: string) => get<any>(path).then((r) => (r.ok ? r.data : Promise.reject(r.message)));

export default function DashboardPage() {
  const supabase = getSupabaseBrowserClient();
  const [userId, setUserId] = React.useState<string | null>(null);
  React.useEffect(() => {
    supabase.auth.getUser().then((u: any) => setUserId(u?.data?.user?.id ?? null));
  }, [supabase.auth]);

  const { data, error, isLoading } = useSWR(() => (userId ? `/bookings?userId=${userId}` : null), fetcher);

  if (!userId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-serif text-2xl text-emerald-900 mb-4">Dashboard</h1>
        <p>Please sign in to view your bookings.</p>
      </div>
    );
  }

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-10">Loading...</div>;
  if (error) return <div className="mx-auto max-w-3xl px-4 py-10">Error: {String(error)}</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="font-serif text-2xl text-emerald-900">My Bookings</h1>
      <ul className="space-y-4">
        {data?.items?.map((b: any) => (
          <li key={b.id} className="p-4 rounded-2xl bg-white lux-gold-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{b.status}</div>
                <div className="text-sm text-charcoal-900/70">{b.startDate} · {b.travelers} travelers</div>
              </div>
              <div className="text-sm font-semibold">${b.total_usd} USD</div>
            </div>
            <div className="mt-4"><QRPass value={`booking:${b.id}`} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}


