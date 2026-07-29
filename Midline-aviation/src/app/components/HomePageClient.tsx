"use client";

import dynamic from "next/dynamic";
import HomeHeroVideo from "@/app/components/ui/HomeHeroVideo";
import HeroBookingForm from "@/app/components/ui/HeroBookingForm";
import HomeCtaBanner from "@/app/components/ui/HomeCtaBanner";
import type { AccreditationLogo } from "@/lib/cms/accreditations";

const ServicesShowcase = dynamic(() => import("@/app/components/ui/ServiceShowcase"), {
  loading: () => null,
});
const PopularDestinationsCarousel = dynamic(
  () => import("@/app/components/ui/PopularDestinationsCarousel"),
  {
    loading: () => null,
  }
);
const TripsMapView = dynamic(() => import("@/app/components/ui/TripsMapView"), {
  loading: () => null,
});
const LogoLoopSection = dynamic(() => import("@/app/components/ui/LogoLoopSection"), {
  loading: () => null,
});
const HomeAircraftCards = dynamic(() => import("@/app/components/ui/HomeAircraftCards"), {
  loading: () => null,
});

type HomePageClientProps = {
  accreditationLogos: AccreditationLogo[];
};

// A pure prop conduit: the fetch stays in the Server Component parent so this
// stays a client boundary with no data access of its own.
export default function HomePageClient({ accreditationLogos }: HomePageClientProps) {
  return (
    <main className="relative z-[1] bg-white">
      <HomeHeroVideo />
      <HeroBookingForm revealFromBelow />
      <ServicesShowcase />
      <PopularDestinationsCarousel />
      <TripsMapView />
      <LogoLoopSection logos={accreditationLogos} />
      <HomeAircraftCards />
      <HomeCtaBanner />
    </main>
  );
}
