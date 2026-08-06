"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlightPathLine from "@/app/components/ui/FlightPathLine";
import { HOME_SERVICES, type ServicesGridContent } from "@/lib/home-content";

/**
 * The five service pages, surfaced as one grid — replaces the retired flight
 * marketplace band. Whole cards are links: the grid exists to route visitors
 * into the service pages, so the entire tile is the target, not a small button.
 *
 * Five cards render as two large over three small (an editorial 2 + 3). The
 * split is computed from the count, so an editor adding or removing a card in
 * the CMS degrades to a uniform three-column grid rather than a broken layout.
 */
export default function HomeServicesGrid({
  content = HOME_SERVICES,
}: {
  content?: ServicesGridContent;
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
      const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]");
      const headerLines = gsap.utils.toArray<HTMLElement>("[data-service-heading-line]");

      if (prefersReducedMotion) {
        gsap.set([...headerLines, ...cards], { y: 0, autoAlpha: 1, clearProps: "all" });
        return;
      }

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

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: isMobile ? 44 : 64, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            ease: "power3.out",
            // Row-mates start together on desktop; on mobile each card enters
            // as it scrolls in, so a per-card trigger with a small delay reads
            // as a stagger without ever animating something still off-screen.
            delay: isMobile ? 0 : (index % 3) * 0.12,
            scrollTrigger: {
              trigger: card,
              start: isMobile ? "top 94%" : "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const cards = content.cards;
  // 2 + 3 only when the count ends the grid on a full row of three (5, 8, …);
  // any other count renders uniform thirds.
  const twoUpFirstRow = cards.length % 3 === 2;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-services-heading"
      className="overflow-x-clip bg-ivory py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <header ref={headerRef} className="mb-10 text-center sm:mb-12 lg:mb-14">
          <p
            data-service-heading-line
            className="text-xs font-medium uppercase tracking-[0.22em] text-ink-muted"
          >
            {content.eyebrow}
          </p>
          <h2
            id="home-services-heading"
            data-service-heading-line
            className="mt-4 text-2xl text-ink sm:text-3xl"
          >
            {content.heading}
          </h2>
          <div data-service-heading-line className="mt-5 flex justify-center">
            <FlightPathLine />
          </div>
          <p
            data-service-heading-line
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-muted"
          >
            {content.intro}
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-6">
          {cards.map((service, index) => {
            const wide = twoUpFirstRow && index < 2;
            return (
              <Link
                key={service.id}
                href={service.href}
                data-service-card
                className={`group flex h-full flex-col bg-card p-4 sm:p-5 ${
                  wide ? "xl:col-span-3" : "xl:col-span-2"
                }`}
              >
                <div
                  className={`relative overflow-hidden ${wide ? "aspect-[16/9]" : "aspect-[3/2]"}`}
                >
                  <Image
                    src={service.imageSrc}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {service.tag ? (
                    <div className="absolute left-3 top-3 inline-flex bg-navy px-3 py-1.5">
                      <span className="text-xs font-medium uppercase tracking-wide text-offwhite">
                        {service.tag}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-1 flex-col">
                  <h3 className="text-[1.05rem] font-medium tracking-tight text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-ink-muted">
                    {service.description}
                  </p>

                  <div className="mt-auto pt-4">
                    <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-champagne-deep">
                      {service.ctaLabel}
                      <span
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
