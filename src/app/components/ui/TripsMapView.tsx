"use client";

import type { MarketplaceContent } from "@/lib/home-content";

import FlightMarketplaceHero from "@/app/components/ui/FlightMarketplaceHero";



export default function TripsMapView({ content }: { content?: MarketplaceContent } = {}) {
  return (
    <section aria-label="Marketplace and services highlights" className="overflow-hidden">
      <FlightMarketplaceHero content={content} />
      
      
    </section>
  );
}
