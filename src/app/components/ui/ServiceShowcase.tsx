"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SHOWCASE_ITEMS, type ShowcaseItem } from "@/lib/home-content";

function ShowcasePanel({ item }: { item: ShowcaseItem }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const mask = maskRef.current;
    const imageInner = imageInnerRef.current;
    const text = textRef.current;
    if (!wrapper || !mask || !imageInner || !text) return;

    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(mask, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(text, { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Release the CSS .js gate while still fully clipped — no flash possible.
      gsap.set(mask, { autoAlpha: 1 });

      // Image mask — wipe reveal from left edge to right
      gsap.fromTo(
        mask,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 80%",
            end: "top 15%",
            scrub: 1.4,
          },
        }
      );

      // Parallax on image inner — scrolls up within clipped container
      gsap.fromTo(
        imageInner,
        { y: "10%" },
        {
          y: "-10%",
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Text — fades and slides up
      gsap.fromTo(
        text,
        { autoAlpha: 0, y: 48 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 78%",
            end: "top 28%",
            scrub: 1.1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const imageBlock = (
    <div
      ref={maskRef}
      data-reveal=""
      className="relative aspect-[16/11] w-full overflow-hidden"
    >
      <div
        ref={imageInnerRef}
        className="absolute inset-x-0"
        style={{ top: "-15%", bottom: "-15%", transform: "translateY(10%)" }}
      >
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
          priority={item.id === "private-charter"}
        />
      </div>
    </div>
  );

  const textBlock = (
    <div ref={textRef} data-reveal="" className="mx-auto w-full max-w-[360px]">
      <h3 className="text-3xl font-light leading-tight text-ink sm:text-[2rem]">{item.title}</h3>
      <p className="mt-3 text-sm text-ink-muted">{item.subtitle}</p>
      <div className="mt-4 h-px w-full bg-hairline" />
      <p className="mt-5 text-sm leading-relaxed text-ink-muted">{item.description}</p>
      <Link
        href={item.href}
        className="mt-6 inline-flex min-h-10 items-center border-b border-ibm-blue pb-0.5 text-sm text-ibm-blue transition-colors hover:border-ibm-blue-60 hover:text-ibm-blue-60"
      >
        {item.ctaLabel}
      </Link>
    </div>
  );

  return (
    <div ref={wrapperRef}>
      <div
        className={`grid items-center gap-8 lg:gap-16 ${
          item.reverse ? "lg:grid-cols-[360px_1fr]" : "lg:grid-cols-[1fr_360px]"
        }`}
      >
        {item.reverse ? textBlock : imageBlock}
        {item.reverse ? imageBlock : textBlock}
      </div>
    </div>
  );
}

export default function ServiceShowcase({
  items = SHOWCASE_ITEMS,
  heading,
}: {
  items?: ShowcaseItem[];
  heading?: string;
} = {}) {
  return (
    <section
      aria-labelledby="service-showcase-heading"
      className="bg-white py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2
          id="service-showcase-heading"
          className="text-center text-3xl font-light tracking-tight text-ink sm:text-4xl"
        >
          Discover <span className="text-ibm-blue">Midline</span>
        </h2>

        <div className="mt-10 space-y-20 lg:mt-14 lg:space-y-28">
          {items.map((item) => (
            <ShowcasePanel key={item.id} item={item} />
          ))}
        </div>

        <div className="sr-only">
          <h3>Midline Aviation Services Overview</h3>
          <p>
            Midline Aviation provides private charter flights and concierge services with global coverage and
            personalized trip planning.
          </p>
        </div>
      </div>
    </section>
  );
}
