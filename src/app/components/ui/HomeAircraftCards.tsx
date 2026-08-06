"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlightPathLine from "@/app/components/ui/FlightPathLine";
import { HOME_AIRCRAFT, type AircraftCard } from "@/lib/home-content";

/**
 * Card media (client review, Aug 2026): horizontal 16:9, no overlaid title or
 * registration chips — the aircraft name lives in the text area below. The
 * same fixed ratio holds on every breakpoint so mobile never auto-crops the
 * aircraft differently.
 */
function HoverVideoCard({ aircraft }: { aircraft: AircraftCard }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="relative aspect-video overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Static image */}
      <Image
        src={aircraft.imageSrc}
        alt={aircraft.imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className={`object-cover transition-all duration-700 group-hover:scale-[1.04] ${hovered ? "opacity-0" : "opacity-100"}`}
        priority
      />

      {/* Video — always mounted, shown on hover */}
      <video
        ref={videoRef}
        src={aircraft.videoSrc}
        muted
        loop
        playsInline
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

export default function HomeAircraftCards({
  cards = HOME_AIRCRAFT,
}: {
  cards?: AircraftCard[];
} = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section || !header) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-aircraft-card]");
      const headerLines = gsap.utils.toArray<HTMLElement>("[data-aircraft-heading-line]");

      if (prefersReducedMotion) {
        gsap.set([header, ...headerLines, ...cards], { x: 0, y: 0, autoAlpha: 1, clearProps: "all" });
        return;
      }

      if (headerLines.length > 0) {
        gsap.fromTo(
          headerLines,
          { y: isMobile ? 28 : 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.14,
            scrollTrigger: {
              trigger: header,
              start: isMobile ? "top 92%" : "top 84%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      cards.forEach((card, index) => {
        const textBlock = card.querySelector<HTMLElement>("[data-aircraft-text]");
        const fromVars =
          index === 0
            ? { x: isMobile ? -48 : -110, y: 0, autoAlpha: 0 }
            : index === 1
              ? { x: 0, y: isMobile ? 56 : 92, autoAlpha: 0 }
              : { x: isMobile ? 48 : 110, y: 0, autoAlpha: 0 };

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: isMobile ? "top 94%" : "top 88%",
            toggleActions: "play none none reverse",
          },
        });

        timeline.fromTo(card, fromVars, { x: 0, y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" });

        if (textBlock) {
          timeline.fromTo(
            textBlock,
            { y: isMobile ? 26 : 40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.65, ease: "power3.out" },
            "-=0.45"
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    // Dark navy fleet panel (client brief §2 hybrid choreography) with solid
    // warm-ivory cards — no outline frames (client review screenshots).
    <section
      ref={sectionRef}
      aria-labelledby="home-aircraft-heading"
      className="overflow-x-clip bg-navy py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <header ref={headerRef} className="mb-10 text-center sm:mb-12 lg:mb-14">
          <h2
            id="home-aircraft-heading"
            data-aircraft-heading-line
            className="text-2xl text-offwhite sm:text-3xl"
          >
            Our Fleet
          </h2>
          <div data-aircraft-heading-line className="mt-5 flex justify-center">
            <FlightPathLine />
          </div>
          <p
            data-aircraft-heading-line
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-inverse-ink-muted"
          >
            Explore three signature aircraft from the Midline fleet, built for comfort, range, and performance.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 lg:gap-8">
          {cards.map((aircraft) => (
            <article
              key={aircraft.id}
              data-aircraft-card
              className="group flex h-full flex-col bg-ivory"
            >
              {aircraft.videoSrc ? (
                <HoverVideoCard aircraft={aircraft} />
              ) : (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={aircraft.imageSrc}
                    alt={aircraft.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              )}

              {/*
                flex-1 with mt-auto on the footer keeps the button on the same
                line across all three cards, whatever length the descriptions
                run to. Aircraft name sits here as the card heading (client
                review) — no overlay chips, no registration, no availability
                pill.
              */}
              <div data-aircraft-text className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-lg font-medium text-ink sm:text-xl">{aircraft.name}</h3>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">{aircraft.description}</p>

                <div className="mt-auto pt-6">
                  <Link
                    href={aircraft.href}
                    className="inline-flex items-center border border-champagne px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-champagne-deep transition-colors duration-300 hover:bg-champagne hover:text-navy"
                  >
                    More Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
