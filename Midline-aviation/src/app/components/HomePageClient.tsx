"use client";

import dynamic from "next/dynamic";
import HomeHeroVideo from "@/app/components/ui/HomeHeroVideo";
import HeroBookingForm from "@/app/components/ui/HeroBookingForm";
import HomeCtaBanner from "@/app/components/ui/HomeCtaBanner";

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

export default function HomePageClient() {
  return (
    <main className="relative z-[1] bg-white">
      <HomeHeroVideo />
      <HeroBookingForm revealFromBelow />
      <ServicesShowcase />
      <PopularDestinationsCarousel />
      <TripsMapView />
      <LogoLoopSection />
      <HomeAircraftCards />
      <HomeCtaBanner />
    </main>
  );
}
