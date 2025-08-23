import Image from "next/image";
import Link from "next/link";
import { Card, CardBody, CardHeader, CardMedia } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatUSD } from "@/lib/utils";

export function PackageCard({
  pkg,
}: {
  pkg: { id: string; title: string; slug: string; priceUsd: number; durationDays: number; luxury?: boolean; imageUrl?: string };
}) {
  return (
    <Card>
      <CardMedia>
        <div className="relative h-48 w-full">
          <Image alt={pkg.title} src={pkg.imageUrl || "/next.svg"} fill className="object-cover" />
        </div>
      </CardMedia>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-emerald-900">{pkg.title}</h3>
          {pkg.luxury && <Badge>Luxury</Badge>}
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex items-center justify-between text-sm">
          <span>{pkg.durationDays} days</span>
          <span className="font-semibold">{formatUSD(pkg.priceUsd)}</span>
        </div>
        <div className="mt-4">
          <Link href={`/packages/${pkg.slug}`} className="text-emerald-900 hover:underline">
            View details →
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}


