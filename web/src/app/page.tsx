import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4">
        <section className="py-16 text-center">
          <p className="text-gold-500 uppercase tracking-wide font-semibold">Luxury African Travel</p>
          <h1 className="font-serif text-4xl md:text-6xl text-emerald-900 mt-4">Journeys in Emerald & Gold</h1>
          <p className="mt-4 text-charcoal-900/80 max-w-2xl mx-auto">Curated destinations, bespoke packages, and secure bookings. USD pricing with QR confirmation.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/destinations"><Button>Explore Destinations</Button></Link>
            <Link href="/packages"><Button variant="outline">View Packages</Button></Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Badge>Verified Partners</Badge>
            <Badge>USD Pricing</Badge>
            <Badge>Secure Payments</Badge>
            <Badge>QR Confirmation</Badge>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
