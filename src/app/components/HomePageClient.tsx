"use client";

import dynamic from "next/dynamic";
import HomeHeroVideo from "@/app/components/ui/HomeHeroVideo";
import HeroBookingForm from "@/app/components/ui/HeroBookingForm";
import HomeCtaBanner from "@/app/components/ui/HomeCtaBanner";
import type { HomeContent } from "@/lib/cms/home";

const ServicesShowcase = dynamic(() => import("@/app/components/ui/ServiceShowcase"), {
  loading: () => null,
});
const PopularDestinationsCarousel = dynamic(
  () => import("@/app/components/ui/PopularDestinationsCarousel"),
  {
    loading: () => null,
  }
);
const HomeServicesGrid = dynamic(() => import("@/app/components/ui/HomeServicesGrid"), {
  loading: () => null,
});
const HomeAircraftCards = dynamic(() => import("@/app/components/ui/HomeAircraftCards"), {
  loading: () => null,
});

type HomePageClientProps = {
  home: HomeContent;
};

// A pure prop conduit: the fetch stays in the Server Component parent so this
// stays a client boundary with no data access of its own.
// Accreditations marquee removed on client review (Aug 2026).
export default function HomePageClient({ home }: HomePageClientProps) {
  return (
    <main className="relative z-[1] bg-background">
      <HomeHeroVideo content={home.hero} />
      <HeroBookingForm revealFromBelow />
      <ServicesShowcase items={home.showcase.items} heading={home.showcase.heading} />
      <PopularDestinationsCarousel cards={home.destinations.cards} />
      <HomeServicesGrid content={home.services} />
      <HomeAircraftCards cards={home.fleet.cards} />
      <HomeCtaBanner content={home.ctaBanner} />
    </main>
  );
}
