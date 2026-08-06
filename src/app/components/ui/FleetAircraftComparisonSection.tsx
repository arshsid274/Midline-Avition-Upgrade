"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Camera,
  ChevronLeft,
  ChevronRight,
  Download,
  Gauge,
  Globe2,
  Ruler,
  Star,
  Users2,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import CountUp from "@/app/components/motion/CountUp";

interface AircraftColumn {
  code: string;
  name: string;
  images: string[];
  badge: string;
  href: string;
  /** Path to the downloadable PDF brochure — button shows "coming soon" when absent. */
  brochure?: string;
}

interface MetricCell {
  value: string;
  note: string;
}

interface MetricRow {
  label: string;
  icon: LucideIcon;
  values: MetricCell[];
  bestIndex: number;
}

const aircraftColumns: AircraftColumn[] = [
  {
    code: "EMBRAER LEGACY 650",
    name: "Embraer Legacy 650",
    images: [
      "/assets/images/aircraft/legacy650-exterior.webp",
      "/assets/images/aircraft/legacy650-cabin-real.webp",
      "/assets/images/aircraft/legacy650-exterior-rear.webp",
    ],
    badge: "Heavy jet",
    href: "/fleet/embraer-legacy-650",
  },
  {
    code: "GULFSTREAM G450",
    name: "Gulfstream G450",
    images: [
      "/assets/images/aircraft/g450-exterior.webp",
      "/assets/images/aircraft/g450-cabin-wide.webp",
      "/assets/images/aircraft/g450-cabin-lounge.webp",
    ],
    badge: "Large jet",
    href: "/fleet/gulfstream-g450",
    brochure: "/PDF/g450.pdf",
  },
  {
    code: "GULFSTREAM G200",
    name: "Gulfstream G200",
    images: [
      "/assets/images/aircraft/g200-exterior.webp",
      "/assets/images/aircraft/g200-cabin.webp",
      "/assets/images/aircraft/g200-galley-detail.webp",
    ],
    badge: "Super midsize",
    href: "/fleet/gulfstream-g200",
    brochure: "/PDF/g200.pdf",
  },
];

const metricRows: MetricRow[] = [
  {
    label: "Max Range",
    icon: Globe2,
    values: [
      { value: "3,900 nm", note: "Intercontinental" },
      { value: "4,350 nm", note: "Transoceanic" },
      { value: "3,400 nm", note: "Cross-country" },
    ],
    bestIndex: 1,
  },
  {
    label: "Cruising Speed",
    icon: Gauge,
    values: [
      { value: "459 kts", note: "Mach 0.80" },
      { value: "476 kts", note: "Mach 0.88" },
      { value: "459 kts", note: "Mach 0.80" },
    ],
    bestIndex: 1,
  },
  {
    label: "Seating Capacity",
    icon: Users2,
    values: [
      { value: "13", note: "Passengers" },
      { value: "14", note: "Passengers" },
      { value: "9", note: "Passengers" },
    ],
    bestIndex: 1,
  },
  {
    label: "Cabin Height",
    icon: Ruler,
    values: [
      { value: "6' 0\"", note: "Stand-up Cabin" },
      { value: "6' 2\"", note: "Stand-up Cabin" },
      { value: "6' 3\"", note: "Stand-up Cabin" },
    ],
    bestIndex: 2,
  },
  {
    label: "Baggage Volume",
    icon: BriefcaseBusiness,
    values: [
      { value: "14-15", note: "Bags" },
      { value: "14-15", note: "Bags" },
      { value: "14-16", note: "Bags" },
    ],
    bestIndex: 2,
  },
];

/** Counts up the numeric part of a metric ("3,900 nm" → animated 3,900 + " nm"). */
function MetricValue({ value }: { value: string }) {
  const match = /^([\d,]+)(.*)$/.exec(value);
  if (!match) return <>{value}</>;
  const numeric = Number(match[1].replace(/,/g, ""));
  return (
    <>
      <CountUp value={numeric} />
      {match[2]}
    </>
  );
}

function AircraftMedia({ aircraft }: { aircraft: AircraftColumn }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageCount = aircraft.images.length;

  const showPreviousImage = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + imageCount) % imageCount);
  };

  const showNextImage = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % imageCount);
  };

  return (
    <div className="group/media relative aspect-[1.75] overflow-hidden bg-surface-1">
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {aircraft.images.map((image, imageIndex) => (
          <div key={`${aircraft.code}-${image}`} className="relative h-full min-w-full">
            <Image
              src={image}
              alt={`${aircraft.name} ${imageIndex === 0 ? "exterior" : "gallery"} view`}
              fill
              sizes="(max-width: 1024px) calc(100vw - 80px), 360px"
              className="object-cover transition-transform duration-500 ease-out group-hover/media:scale-[1.035]"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />
      <span className="absolute bottom-3 left-3 bg-ink px-3 py-1 text-xs font-medium text-white">
        {aircraft.badge}
      </span>
      <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 bg-black/60 px-3 py-1 text-xs font-medium text-white">
        <Camera className="h-3.5 w-3.5" />
        {activeIndex + 1}/{imageCount}
      </span>

      <button
        type="button"
        aria-label={`Show previous ${aircraft.name} image`}
        onClick={showPreviousImage}
        className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-white/90 text-ink transition-[background-color,transform,opacity] duration-150 ease-out hover:bg-white active:scale-[0.96] sm:opacity-0 sm:group-hover/media:opacity-100"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label={`Show next ${aircraft.name} image`}
        onClick={showNextImage}
        className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-white/90 text-ink transition-[background-color,transform,opacity] duration-150 ease-out hover:bg-white active:scale-[0.96] sm:opacity-0 sm:group-hover/media:opacity-100"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {aircraft.images.map((image, index) => (
          <button
            type="button"
            key={`${image}-dot`}
            aria-label={`Show ${aircraft.name} image ${index + 1}`}
            aria-current={activeIndex === index ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
            className={`h-2 w-2 rounded-full transition-[background-color,transform] duration-150 ease-out active:scale-[0.86] ${
              activeIndex === index ? "bg-white" : "bg-white/55 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function FleetAircraftComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollReveal(sectionRef, { stagger: 0.14 });

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-surface-1 py-16 sm:py-20 lg:py-24"
    >
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(22,22,22,1) 1px, transparent 1px, transparent 72px), repeating-linear-gradient(to bottom, rgba(22,22,22,1) 1px, transparent 1px, transparent 72px)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-16">
        <div data-reveal-item className="mb-10 max-w-2xl sm:mb-12">
          <p className="text-sm text-ink-muted">Specifications</p>
          <h2 className="font-display mt-3 text-4xl font-light text-ink sm:text-5xl">
            Metrics
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
            Compare aircraft range, speed, cabin comfort, and storage in a cleaner card format inspired by the latest
            fleet design.
          </p>
        </div>

        <div data-reveal-item className="overflow-hidden border border-hairline bg-white">
          <div className="flex flex-col lg:flex-row">
            <div className="hidden w-64 shrink-0 flex-col border-r border-hairline bg-surface-1 lg:flex">
              <div className="h-[480px] border-b border-hairline p-6" />
              <div className="flex flex-col">
                {metricRows.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="flex h-24 items-center border-b border-hairline px-6">
                      <div className="flex items-center gap-3 text-ink-muted">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-2">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium">{metric.label}</span>
                      </div>
                    </div>
                  );
                })}
                <div className="h-24 border-b border-hairline" />
              </div>
            </div>

            <div className="grid flex-1 gap-6 p-4 lg:grid-cols-3 lg:gap-0 lg:p-0">
              {aircraftColumns.map((aircraft, aircraftIndex) => (
                <article
                  key={aircraft.code}
                  className={`relative flex min-w-0 flex-col overflow-hidden border border-hairline bg-white lg:border-y-0 lg:border-l-0 ${
                    aircraftIndex < aircraftColumns.length - 1 ? "lg:border-r" : "lg:border-r-0"
                  }`}
                >
                  <div className="flex h-auto flex-col border-b border-hairline p-5 lg:h-[480px] lg:p-6">
                    <AircraftMedia aircraft={aircraft} />

                    <h3 className="font-display mt-6 text-2xl font-medium text-ink">
                      {aircraft.name}
                    </h3>

                    {aircraft.brochure ? (
                      <a
                        href={aircraft.brochure}
                        download={`Midline-Aviation-${aircraft.name.replace(/\s+/g, "-")}-Brochure.pdf`}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-champagne bg-white px-4 py-3 text-sm font-normal uppercase tracking-wide text-champagne-deep transition-[background-color,transform,color] duration-150 ease-out hover:bg-champagne hover:text-navy active:scale-[0.98] lg:mt-auto"
                      >
                        <Download className="h-4 w-4" />
                        Download Brochure
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 border border-hairline px-4 py-3 text-sm font-normal text-ink-muted opacity-60 lg:mt-auto"
                      >
                        <Download className="h-4 w-4" />
                        Brochure Coming Soon
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col">
                    {metricRows.map((metric) => {
                      const Icon = metric.icon;
                      const cell = metric.values[aircraftIndex];
                      const isBest = metric.bestIndex === aircraftIndex;

                      return (
                        <div
                          key={`${aircraft.code}-${metric.label}`}
                          className={`relative flex min-h-24 items-center justify-between gap-4 border-b border-hairline px-5 py-4 transition-colors duration-150 ease-out hover:bg-surface-1 lg:h-24 lg:flex-col lg:justify-center lg:gap-1 lg:px-4 lg:text-center ${
                            isBest ? "bg-surface-1" : ""
                          }`}
                        >
                          {isBest && (
                            <Star className="absolute right-3 top-3 h-3.5 w-3.5 fill-champagne-deep text-champagne-deep" />
                          )}
                          <div className="flex items-center gap-2 text-left text-ink-muted lg:hidden">
                            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="text-xs font-semibold">{metric.label}</span>
                          </div>
                          <div className="min-w-[7rem] text-right lg:min-w-0 lg:text-center">
                            <div className="text-xl font-semibold tracking-[-0.01em] text-ink">
                              <MetricValue value={cell.value} />
                            </div>
                            <div className="mt-0.5 text-sm text-ink-muted">{cell.note}</div>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex h-20 items-center justify-center border-b border-hairline px-5 lg:h-24">
                      <Link
                        href={aircraft.href}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-champagne-deep transition-[color,transform] duration-150 ease-out hover:text-champagne-deep active:scale-[0.98]"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
