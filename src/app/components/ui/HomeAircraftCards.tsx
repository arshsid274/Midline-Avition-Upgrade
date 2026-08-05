"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HOME_AIRCRAFT, type AircraftCard } from "@/lib/home-content";

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
      className="relative aspect-[16/10] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Static image */}
      <Image
        src={aircraft.imageSrc}
        alt={aircraft.imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className={`object-cover transition-opacity duration-500 ${hovered ? "opacity-0" : "opacity-100"}`}
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
        <div className="inline-flex bg-ink px-3.5 py-2">
          <h3 className="text-[1.05rem] font-medium tracking-tight text-white">{aircraft.name}</h3>
        </div>
        <div className="inline-flex bg-ink px-3 py-2">
          <span className="font-mono text-xs font-medium text-white">{aircraft.registration}</span>
        </div>
      </div>
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
    <section
      ref={sectionRef}
      aria-labelledby="home-aircraft-heading"
      className="overflow-x-clip bg-white py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <header ref={headerRef} className="mb-8 text-center sm:mb-10 lg:mb-12">
          <p data-aircraft-heading-line className="text-sm text-ink-muted">
            Fleet
          </p>
          <h2
            id="home-aircraft-heading"
            data-aircraft-heading-line
            className="mt-3 text-3xl font-light tracking-tight text-ink sm:text-4xl"
          >
            Our Fleet
          </h2>
          <p
            data-aircraft-heading-line
            className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base"
          >
            Explore three signature aircraft from the Midline fleet, built for comfort, range, and performance.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((aircraft) => (
            <article
              key={aircraft.id}
              data-aircraft-card
              className="flex h-full flex-col border border-hairline bg-white p-4 transition-colors hover:bg-surface-1 sm:p-5"
            >
              {aircraft.videoSrc ? (
                <HoverVideoCard aircraft={aircraft} />
              ) : (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={aircraft.imageSrc}
                    alt={aircraft.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div className="inline-flex bg-ink px-3.5 py-2">
                      <h3 className="text-[1.05rem] font-medium tracking-tight text-white">{aircraft.name}</h3>
                    </div>
                    <div className="inline-flex bg-ink px-3 py-2">
                      <span className="font-mono text-xs font-medium text-white">{aircraft.registration}</span>
                    </div>
                  </div>
                </div>
              )}

              {/*
                flex-1 with mt-auto on the footer keeps the badge and button on
                the same line across all three cards, whatever length the
                descriptions run to. The 3D version could not do this: every
                element sat on its own translateZ plane, so heights were
                independent per card and the actions came out ragged.
              */}
              <div data-aircraft-text className="mt-4 flex flex-1 flex-col">
                <p className="text-sm leading-relaxed text-ink-muted">{aircraft.description}</p>

                <div className="mt-auto space-y-4 pt-4">
                  <div className="inline-flex items-center border border-hairline bg-surface-1 px-3 py-1 text-xs font-medium text-ink">
                    {aircraft.comingSoon ? "Coming Soon" : "Available Now"}
                  </div>

                  <div>
                    <Link
                      href={aircraft.href}
                      className="inline-flex items-center border border-ibm-blue bg-white px-4 py-2 text-sm text-ibm-blue uppercase tracking-wide transition hover:bg-ibm-blue hover:text-white"
                    >
                      More Details
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
