"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { featureSlides, type FeatureKey, type FeatureSlide } from "@/lib/about-content";




export default function ContactLegacyStorySection({
  slides = featureSlides,
}: {
  slides?: FeatureSlide[];
} = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("charters");

  const activeSlide = useMemo(
    () => slides.find((slide) => slide.key === activeFeature) ?? slides[0],
    [activeFeature],
  );

  useScrollReveal(sectionRef, { stagger: 0.14 });

  return (
    <section
      ref={sectionRef}
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[var(--midline-bg-soft)] py-10 sm:py-12"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div data-reveal-item className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-[2.2rem] font-light text-[var(--midline-navy)] sm:text-[2.6rem]">
            What we do
          </h1>
          <p className="mx-auto mt-2 max-w-[34rem] text-[0.77rem] leading-[1.72] text-[color:color-mix(in_srgb,var(--midline-navy)_70%,white_30%)] sm:text-[0.82rem]">
            We are the one-stop-shop you need to book a business flight, plan a relaxing getaway, or discover your
            next adventure.
          </p>
        </div>

        <div data-reveal-item className="mt-4 flex justify-center sm:mt-5">
          <div className="inline-flex items-center border border-hairline bg-white p-1">
            {slides.map((slide) => (
              <button
                key={slide.key}
                type="button"
                onClick={() => setActiveFeature(slide.key)}
                aria-pressed={activeFeature === slide.key}
                className={`px-3 py-1.5 text-[0.63rem] font-medium tracking-[0.01em] transition-colors focus-visible:outline-2 focus-visible:outline-champagne sm:px-4 ${
                  activeFeature === slide.key
                    ? "bg-[var(--midline-navy)] text-white"
                    : "text-[var(--midline-navy)] hover:bg-[color:color-mix(in_srgb,var(--midline-bg-soft)_65%,white_35%)] hover:text-[var(--midline-cyan-strong)]"
                }`}
              >
                {slide.label}
              </button>
            ))}
          </div>
        </div>

        <article data-reveal-item className="mt-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-10">
            <div>
              <p className="text-sm text-ink-muted">
                {activeSlide.eyebrow}
              </p>
              <h3
                className="font-display mt-2 text-[2rem] font-light leading-[1.08] text-[var(--midline-navy)] sm:text-[2.3rem]"
              >
                {activeSlide.title}
              </h3>
              <p className="mt-3 text-[0.77rem] leading-[1.72] text-[color:color-mix(in_srgb,var(--midline-navy)_74%,white_26%)] sm:text-[0.82rem]">
                {activeSlide.description}
              </p>
              <Link href={activeSlide.ctaHref} className="midline-btn-primary mt-4 inline-flex items-center gap-2 px-4 py-2 text-[0.72rem]">
                Book now
                <span aria-hidden>&rarr;</span>
              </Link>
            </div>

            <figure className="relative h-[340px] overflow-hidden bg-surface-1 sm:h-[420px] lg:h-[450px]">
              <Image
                key={activeSlide.key}
                src={activeSlide.imageSrc}
                alt={activeSlide.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-cover"
                style={{ objectPosition: activeSlide.imagePosition }}
                priority
              />
            </figure>
          </div>
        </article>

        <article data-reveal-item className="mt-12 sm:mt-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
            <figure className="relative h-[280px] overflow-hidden bg-surface-1 sm:h-[320px] lg:h-[360px]">
              <Image
                src="/assets/images/aircraft/g200-exterior.webp"
                alt="Gulfstream G200 on the runway"
                fill
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover"
                style={{ objectPosition: "center 62%" }}
              />
            </figure>

            <div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-1">
                <span aria-hidden className="h-3.5 w-3.5 bg-[var(--midline-navy)]" />
              </span>
              <h3
                className="font-display mt-3 text-[2.05rem] font-light leading-[1.08] text-[var(--midline-navy)] sm:text-[2.35rem]"
              >
                Our story
              </h3>
              <div className="mt-3 space-y-3">
                <p className="text-[0.77rem] leading-[1.72] text-[color:color-mix(in_srgb,var(--midline-navy)_74%,white_26%)] sm:text-[0.82rem]">
                  Since 2019, Midline has modernized private aviation by making booking more transparent and efficient,
                  with live aircraft availability, clear pricing, and faster confirmations.
                </p>
                <p className="text-[0.77rem] leading-[1.72] text-[color:color-mix(in_srgb,var(--midline-navy)_74%,white_26%)] sm:text-[0.82rem]">
                  Our journey began by supporting regional operators with advanced aviation tools while improving
                  aircraft utilization through shared opportunities and empty-leg visibility.
                </p>
                <p className="text-[0.77rem] leading-[1.72] text-[color:color-mix(in_srgb,var(--midline-navy)_74%,white_26%)] sm:text-[0.82rem]">
                  Today, we serve clients across multiple markets and continue to scale with a clear mission: seamless,
                  reliable, and experience-first private flight.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
