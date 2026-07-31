"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Plane, Users } from "lucide-react";
import gsap from "gsap";
import { WorldMap } from "./WorldMap";
import { MARKETPLACE, type JetVisualKey, type MarketplaceContent } from "@/lib/home-content";


export const JET_DATA = [
  {
    id: 1,
    tail: "T7-MID",
    jet: "Gulfstream (Heavy)",
    model: "Gulfstream G450",
    visualKey: "gulfstream-heavy",
    capacity: 13,
    cruiseSpeed: "533 kts",
    rangeNm: 3900,
    baggage: "12-14 Bags",
    interior: "VIP/Bed",
    year: 2013,

    fromICAO: "OMDB",
    toICAO: "EGLL",
    fromCity: "Dubai",
    toCity: "London",
    distanceNm: 2950,
    duration: "6h 10m",

    operator: "Private Fleet",
    lat1: 25.2532,
    lng1: 55.3657,
    lat2: 51.4700,
    lng2: -0.4543,
  },

  {
    id: 2,
    tail: "T7-MIDA",
    jet: "Gulfstream (Mid Size)",
    model: "Gulfstream G200",
    visualKey: "gulfstream-mid-size",
    capacity: 8,
    cruiseSpeed: "459 kts",
    rangeNm: 3100,
    baggage: "12-14 Bags",
    interior: "VIP",
    year: 2011,

    fromICAO: "OMDB",
    toICAO: "VIDP",
    fromCity: "Dubai",
    toCity: "Delhi",
    distanceNm: 1180,
    duration: "2h 40m",

    operator: "Private Fleet",
    lat1: 25.2532,
    lng1: 55.3657,
    lat2: 28.5562,
    lng2: 77.1000,
  },

  {
    id: 3,
    tail: "T7-MIDB",
    jet: "Embraer (Heavy)",
    model: "Embraer Legacy 650",
    visualKey: "embraer-heavy",
    capacity: 13,
    cruiseSpeed: "460 kts",
    rangeNm: 3900,
    baggage: "Up to 20 Bags",
    interior: "VIP/Bed",
    year: 2015,

    fromICAO: "OMDB",
    toICAO: "LSZH",
    fromCity: "Dubai",
    toCity: "Zurich",
    distanceNm: 2550,
    duration: "5h 40m",

    operator: "Private Fleet",
    lat1: 25.2532,
    lng1: 55.3657,
    lat2: 47.4581,
    lng2: 8.5555,
  },

  {
    id: 4,
    tail: "T7-MID",
    jet: "Gulfstream (Heavy)",
    model: "Gulfstream G450",
    visualKey: "gulfstream-heavy",
    capacity: 13,
    cruiseSpeed: "533 kts",
    rangeNm: 3900,
    baggage: "12-14 Bags",
    interior: "VIP/Bed",
    year: 2013,

    fromICAO: "OMDB",
    toICAO: "KJFK",
    fromCity: "Dubai",
    toCity: "New York",
    distanceNm: 5900,
    duration: "12h 10m",

    operator: "Private Fleet",
    lat1: 25.2532,
    lng1: 55.3657,
    lat2: 40.6413,
    lng2: -73.7781,
  },

  {
    id: 5,
    tail: "T7-MIDA",
    jet: "Gulfstream (Mid Size)",
    model: "Gulfstream G200",
    visualKey: "gulfstream-mid-size",
    capacity: 8,
    cruiseSpeed: "459 kts",
    rangeNm: 3100,
    baggage: "12-14 Bags",
    interior: "VIP",
    year: 2011,

    fromICAO: "OMDB",
    toICAO: "LTFM",
    fromCity: "Dubai",
    toCity: "Istanbul",
    distanceNm: 1850,
    duration: "4h 25m",

    operator: "Private Fleet",
    lat1: 25.2532,
    lng1: 55.3657,
    lat2: 41.2753,
    lng2: 28.7519,
  },

  {
    id: 6,
    tail: "T7-MIDB",
    jet: "Embraer (Heavy)",
    model: "Embraer Legacy 650",
    visualKey: "embraer-heavy",
    capacity: 13,
    cruiseSpeed: "460 kts",
    rangeNm: 3900,
    baggage: "Up to 20 Bags",
    interior: "VIP/Bed",
    year: 2015,

    fromICAO: "OMDB",
    toICAO: "WSSS",
    fromCity: "Dubai",
    toCity: "Singapore",
    distanceNm: 3150,
    duration: "7h 15m",

    operator: "Private Fleet",
    lat1: 25.2532,
    lng1: 55.3657,
    lat2: 1.3644,
    lng2: 103.9915,
  },

  {
    id: 7,
    tail: "T7-MID",
    jet: "Gulfstream (Heavy)",
    model: "Gulfstream G450",
    visualKey: "gulfstream-heavy",
    capacity: 13,
    cruiseSpeed: "533 kts",
    rangeNm: 3900,
    baggage: "12-14 Bags",
    interior: "VIP/Bed",
    year: 2013,

    fromICAO: "OMAA",
    toICAO: "HECA",
    fromCity: "Abu Dhabi",
    toCity: "Cairo",
    distanceNm: 1300,
    duration: "2h 50m",

    operator: "Private Fleet",
    lat1: 24.4330,
    lng1: 54.6511,
    lat2: 30.1219,
    lng2: 31.4056,
  },

  {
    id: 8,
    tail: "T7-MIDA",
    jet: "Gulfstream (Mid Size)",
    model: "Gulfstream G200",
    visualKey: "gulfstream-mid-size",
    capacity: 8,
    cruiseSpeed: "459 kts",
    rangeNm: 3100,
    baggage: "12-14 Bags",
    interior: "VIP",
    year: 2011,

    fromICAO: "OMDW",
    toICAO: "OOMS",
    fromCity: "Dubai",
    toCity: "Muscat",
    distanceNm: 190,
    duration: "50m",

    operator: "Private Fleet",
    lat1: 24.8964,
    lng1: 55.1614,
    lat2: 23.5933,
    lng2: 58.2844,
  }
];


type JetDeal = (typeof JET_DATA)[number];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Photographs for a route's aircraft, looked up by the CMS `aircraft` key.
 *
 * Falls back to the first entry rather than throwing: an editor can delete a
 * row, and a missing photograph must not take down the map.
 */
const makeGetJetVisuals = (visuals: MarketplaceContent["jetVisuals"]) => (visualKey: string) => {
  const match = visuals.find((v) => v.aircraft === (visualKey as JetVisualKey));
  const chosen = match ?? visuals[0] ?? MARKETPLACE.jetVisuals[0];
  return {
    exteriorSrc: chosen.exterior.src,
    exteriorAlt: chosen.exterior.alt,
    interiorSrc: chosen.interior.src,
    interiorAlt: chosen.interior.alt,
  };
};

const FlightCard = React.memo(function FlightCard({
  deal,
  isActive,
  getJetVisuals,
}: {
  deal: JetDeal;
  isActive: boolean;
  getJetVisuals: (visualKey: string) => {
    exteriorSrc: string;
    exteriorAlt: string;
    interiorSrc: string;
    interiorAlt: string;
  };
}) {
  const routeTrackRef = React.useRef<HTMLDivElement>(null);
  const planeRef = React.useRef<HTMLDivElement>(null);
  const planeTweenRef = React.useRef<gsap.core.Tween | null>(null);
  const visuals = getJetVisuals(deal.visualKey);

  useEffect(() => {
    const track = routeTrackRef.current;
    const plane = planeRef.current;
    if (!track || !plane) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const stopAnimation = () => {
      planeTweenRef.current?.kill();
      planeTweenRef.current = null;
    };

    const centerPlane = () => {
      gsap.set(plane, {
        left: "50%",
        x: 0,
        xPercent: -50,
        yPercent: -50,
      });
    };

    const animatePlane = () => {
      stopAnimation();

      if (!isActive || prefersReducedMotion) {
        centerPlane();
        return;
      }

      const travelDistance = Math.max(track.clientWidth - plane.clientWidth, 0);
      if (travelDistance <= 0) {
        centerPlane();
        return;
      }

      gsap.set(plane, {
        left: 0,
        x: 0,
        xPercent: 0,
        yPercent: -50,
      });

      planeTweenRef.current = gsap.to(plane, {
        x: travelDistance,
        duration: 2.35,
        repeat: -1,
        ease: "none",
      });
    };

    animatePlane();
    if (isActive) {
      window.addEventListener("resize", animatePlane);
    }

    return () => {
      if (isActive) {
        window.removeEventListener("resize", animatePlane);
      }
      stopAnimation();
    };
  }, [isActive]);

  return (
    <article
      role="listitem"
      aria-label={`${deal.jet} from ${deal.fromCity} to ${deal.toCity}`}
      className="min-w-0 flex-[0_0_100%] px-2 py-4 sm:flex-[0_0_74%] sm:px-2.5 md:flex-[0_0_62%] lg:flex-[0_0_74%] xl:flex-[0_0_58%] 2xl:flex-[0_0_52%]"
    >
      <div
        className={`h-full border p-2 transition-all duration-500 sm:p-2.5 ${
          isActive
            ? "border-ibm-blue bg-inverse-canvas sm:scale-[1.02]"
            : "border-inverse-surface-1 bg-inverse-canvas opacity-80"
        }`}
      >
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div className="relative h-20 overflow-hidden sm:h-24">
            <Image
              src={visuals.exteriorSrc}
              alt={visuals.exteriorAlt}
              fill
              sizes="(max-width: 640px) 42vw, 220px"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-1.5 left-2 right-2 flex items-end justify-between">
              <p className="text-[10px] font-medium text-white/80">Exterior</p>
              <span className="font-mono text-[9px] font-semibold tracking-widest text-white/80">{deal.tail}</span>
            </div>
          </div>
          <div className="relative h-20 overflow-hidden sm:h-24">
            <Image
              src={visuals.interiorSrc}
              alt={visuals.interiorAlt}
              fill
              sizes="(max-width: 640px) 42vw, 220px"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <p className="absolute bottom-1.5 left-2 text-[10px] font-medium text-white/80">
              Interior
            </p>
          </div>
        </div>

        <div className="bg-inverse-surface-1 p-3.5 sm:p-4">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-white sm:text-base">{deal.model}</h3>
              <p className="truncate text-[11px] text-white/60">{deal.jet}</p>
              <p className="mt-0.5 font-mono text-[10px] font-semibold tracking-widest text-white/50">{deal.tail}</p>
            </div>
            <div className="flex shrink-0 items-center border border-white/20 px-2 py-0.5 text-[11px] text-white/80">
              <Users size={12} className="mr-1" />
              <span>{deal.capacity}</span>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-2.5">
            <div className="min-w-0 pr-1.5">
              <p className="truncate whitespace-nowrap font-mono text-xs font-semibold text-white">{deal.fromICAO}</p>
              <p className="truncate text-[11px] text-inverse-ink-muted">{deal.fromCity}</p>
            </div>

            <div ref={routeTrackRef} className="relative h-6 w-[84px] sm:w-[106px]">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-dashed border-white/30" />
              <div
                ref={planeRef}
                className={`absolute top-1/2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-ibm-blue transition-colors duration-300 ${
                  isActive ? "text-white" : "text-white/50"
                }`}
              >
                <Plane size={16} className="rotate-[48deg]" />
              </div>
            </div>

            <div className="min-w-0 pl-1.5 text-right">
              <p className="truncate whitespace-nowrap font-mono text-xs font-semibold text-white">{deal.toICAO}</p>
              <p className="truncate text-[11px] text-inverse-ink-muted">{deal.toCity}</p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 border-t border-white/15 pt-3.5">
            <div className="min-w-0">
              <p className="text-[10px] text-inverse-ink-muted">Operator</p>
              <p className="truncate text-xs font-semibold text-white sm:text-sm">{deal.operator}</p>
            </div>
            <div className="min-w-0 text-right">
              <p className="text-[10px] text-inverse-ink-muted">Flight Time</p>
              <p className="truncate text-xs font-semibold text-white sm:text-sm">{deal.duration}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});

FlightCard.displayName = "FlightCard";

export default function FlightMarketplaceHero({
  content = MARKETPLACE,
}: {
  content?: MarketplaceContent;
} = {}) {
  const getJetVisuals = useMemo(
    () => makeGetJetVisuals(content.jetVisuals),
    [content.jetVisuals]
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: false,
      duration: 45,
    },
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const activeDeal = JET_DATA[selectedIndex] ?? JET_DATA[0];
  const currentRoute = useMemo(
    () => [
      {
        start: { lat: activeDeal.lat1, lng: activeDeal.lng1 },
        end: { lat: activeDeal.lat2, lng: activeDeal.lng2 },
      },
    ],
    [activeDeal]
  );

  const mapFocus = useMemo(() => {
    const latDelta = Math.abs(activeDeal.lat1 - activeDeal.lat2);
    const lngDelta = Math.abs(activeDeal.lng1 - activeDeal.lng2);
    const routeSpan = Math.max(latDelta, lngDelta);

    const destinationBiasedLat = activeDeal.lat1 * 0.3 + activeDeal.lat2 * 0.7;
    const destinationBiasedLng = activeDeal.lng1 * 0.3 + activeDeal.lng2 * 0.7;
    const zoom = clamp(2.2 - routeSpan / 24, 1.25, 2.15);

    return {
      lat: destinationBiasedLat,
      lng: destinationBiasedLng,
      zoom,
    };
  }, [activeDeal]);

  return (
    <section
      aria-labelledby="flight-marketplace-heading"
      className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[43%] bg-white lg:block" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-[43%] hidden w-28 bg-gradient-to-r from-transparent to-white lg:block"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <header className="mb-8 sm:mb-10 lg:mb-12">
          <p className="text-sm text-ink-muted">{content.eyebrow}</p>
          <h2
            id="flight-marketplace-heading"
            className="mt-3 max-w-3xl text-2xl font-light tracking-tight text-ink sm:text-3xl md:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-ink-muted sm:text-base">
            {content.intro}
          </p>
          <p className="sr-only" aria-live="polite">
            Active marketplace route: {activeDeal.fromCity} ({activeDeal.fromICAO}) to {activeDeal.toCity} (
            {activeDeal.toICAO}) operated by {activeDeal.operator}.
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-stretch lg:gap-7">
          {/* Mobile: carousel card stacks first (per the mobile booking design), map card follows.
              min-w-0 is load-bearing: grid items default to min-width:auto, and the carousel's
              no-wrap slide row would otherwise blow the column out wider than the viewport. */}
          <div className="relative min-w-0 border border-inverse-surface-1 bg-inverse-canvas p-3 sm:p-4">
            <div className="mb-3">
              <p className="text-sm text-inverse-ink-muted">Available Flights</p>
              <p className="mt-1 text-xs text-inverse-ink-muted sm:text-sm">
                Browse live route cards and the map updates to match your selection.
              </p>
            </div>

            <div className="relative">
              <div className="relative mx-auto w-full">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-inverse-canvas to-transparent sm:w-16"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-inverse-canvas to-transparent sm:w-16"
                />
                <div className="overflow-hidden" ref={emblaRef}>
                  <div
                    role="list"
                    aria-label="Available private jet routes"
                    className="flex cursor-grab active:cursor-grabbing"
                  >
                    {JET_DATA.map((deal, index) => (
                      <FlightCard key={deal.id} deal={deal} isActive={index === selectedIndex} getJetVisuals={getJetVisuals} />
                    ))}
                  </div>
                </div>

                {/* Floating edge arrows — overlap the active card on every breakpoint. */}
                <button
                  type="button"
                  aria-label="Previous route"
                  onClick={() => emblaApi?.scrollPrev()}
                  className="absolute left-1 top-1/2 z-20 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/30 bg-inverse-canvas text-white transition-colors hover:bg-inverse-surface-1 sm:left-2 sm:h-10 sm:w-10"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next route"
                  onClick={() => emblaApi?.scrollNext()}
                  className="absolute right-1 top-1/2 z-20 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/30 bg-inverse-canvas text-white transition-colors hover:bg-inverse-surface-1 sm:right-2 sm:h-10 sm:w-10"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Pagination dots — active route stretches into a pill. */}
              <div className="mt-4 flex items-center justify-center gap-1.5" role="tablist" aria-label="Route pagination">
                {JET_DATA.map((deal, index) => (
                  <button
                    key={`dot-${deal.id}`}
                    type="button"
                    role="tab"
                    aria-selected={index === selectedIndex}
                    aria-label={`Show route ${deal.fromCity} to ${deal.toCity}`}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === selectedIndex ? "w-5 bg-ibm-blue" : "w-1.5 bg-white/25 hover:bg-white/45"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <aside className="relative flex min-h-[300px] min-w-0 flex-col overflow-hidden border border-inverse-surface-1 bg-inverse-canvas p-4 sm:min-h-[360px] sm:p-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-inverse-canvas/90 to-transparent"
            />
            <p className="relative text-sm text-inverse-ink-muted">
              Interactive Map
            </p>
            <h3 className="relative mt-2 text-lg font-semibold text-white sm:text-xl">
              {activeDeal.fromCity} to {activeDeal.toCity}
            </h3>
            <p className="relative mt-1 text-xs text-inverse-ink-muted sm:text-sm">
              {activeDeal.fromICAO} to {activeDeal.toICAO} - {activeDeal.operator}
            </p>

            <div className="relative mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-inverse-surface-1 p-2.5">
                <p className="text-[10px] text-inverse-ink-muted">Aircraft</p>
                <p className="mt-1 text-sm font-semibold text-white">{activeDeal.model}</p>
              </div>
              <div className="bg-inverse-surface-1 p-2.5">
                <p className="text-[10px] text-inverse-ink-muted">Flight Time</p>
                <p className="mt-1 text-sm font-semibold text-white">{activeDeal.duration}</p>
              </div>
            </div>

            <figure className="relative mt-3 h-56 overflow-hidden border border-inverse-surface-1 sm:mt-4 sm:h-64 lg:h-auto lg:flex-1">
              <WorldMap dots={currentRoute} lineColor="#0f62fe" focus={mapFocus} />
              <figcaption className="sr-only">
                Route map highlighting flights between {activeDeal.fromCity} and {activeDeal.toCity}.
              </figcaption>
            </figure>
          </aside>
        </div>

        {/* Mobile booking CTA — full-width, tracks the active route (per the mobile design). */}
        <div className="mt-6 lg:hidden">
          <Link
            href="/#book-your-flight"
            className="flex w-full items-center justify-center bg-ibm-blue py-4 text-sm font-normal uppercase tracking-wide text-white transition-colors hover:bg-ibm-blue-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ibm-blue"
          >
            Book {activeDeal.fromCity} – {activeDeal.toCity}
          </Link>
        </div>

        <div className="sr-only">
          <h3>Private jet marketplace routes</h3>
          <ul>
            {JET_DATA.map((deal) => (
              <li key={`seo-route-${deal.id}`}>
                {deal.jet} from {deal.fromCity} ({deal.fromICAO}) to {deal.toCity} ({deal.toICAO}), operated by{" "}
                {deal.operator}.
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
