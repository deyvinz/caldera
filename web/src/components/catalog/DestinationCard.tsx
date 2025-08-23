import Image from "next/image";
import Link from "next/link";
import { Card, CardBody, CardHeader, CardMedia } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DestinationCard({
  destination,
}: {
  destination: { id: string; name: string; slug: string; country?: string; imageUrl?: string };
}) {
  return (
    <Card>
      <CardMedia>
        <div className="relative h-48 w-full">
          <Image
            alt={destination.name}
            src={destination.imageUrl || "/next.svg"}
            fill
            className="object-cover"
          />
        </div>
      </CardMedia>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-emerald-900">{destination.name}</h3>
          <Badge>{destination.country || ""}</Badge>
        </div>
      </CardHeader>
      <CardBody>
        <Link href={`/destinations/${destination.slug}`} className="text-emerald-900 hover:underline">
          Explore →
        </Link>
      </CardBody>
    </Card>
  );
}


