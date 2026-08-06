import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";
import { iconFor } from "@/lib/icons";
import {
  SERVICE_FEATURES,
  type FeatureCard,
  type ServiceHero,
  type ServiceSection,
  SERVICE_HEROES,
} from "@/lib/service-content";

const MRO_CAPABILITIES = SERVICE_FEATURES["mro-page"] as ServiceSection<FeatureCard>;

const TICKER_ITEMS = Array.from({ length: 8 });

export default function MROComingSoon({
  hero = SERVICE_HEROES["mro-page"],
  capabilities = MRO_CAPABILITIES,
}: {
  hero?: ServiceHero;
  capabilities?: ServiceSection<FeatureCard>;
} = {}) {
  // The scrolling band repeats the headline. Derived rather than duplicated, so
  // editing the headline cannot leave the ticker saying something else.
  const tickerText = [hero.heading, hero.headingAccent, hero.headingRest]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <section className="relative isolate flex min-h-[calc(100svh-72px)] w-full flex-col overflow-hidden md:min-h-[calc(100svh-84px)]">
      {/* Real T7-MID ground-handling photography, slow Ken-Burns drift */}
      <Image
        src={hero.image.src}
        alt={hero.image.alt}
        fill
        sizes="100vw"
        className="object-cover object-center hero-kenburns"
        priority
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,38,50,0.80)_0%,rgba(10,38,50,0.62)_55%,rgba(10,38,50,0.88)_100%)]" />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <Reveal as="div" on="load" variant="fade-up" delay={0.05}>
          <p className="inline-flex items-center gap-2.5 text-sm text-inverse-ink-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-champagne opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-champagne" />
            </span>
            Aircraft MRO · Maintenance, Repair &amp; Overhaul
          </p>
        </Reveal>

        {/* The statement — the largest element on the page by far */}
        <SplitHeading
          as="h1"
          mode="lcp"
          on="load"
          delay={0.2}
          className="font-display mt-7 text-6xl font-light leading-[0.98] tracking-[-0.03em] text-offwhite sm:text-8xl lg:text-9xl"
        >
          {hero.heading}
          {hero.headingAccent ? (
            <> <span className="italic text-champagne">{hero.headingAccent}</span></>
          ) : null}
          {hero.headingRest}
        </SplitHeading>

        <Reveal as="div" on="load" variant="fade-up" delay={0.6}>
          <p className="font-display mx-auto mt-6 max-w-2xl text-xl font-normal leading-snug text-white/85 sm:text-2xl">
            {hero.body}
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/68 sm:text-base">
            {hero.bodySecondary}
          </p>
        </Reveal>

        <Reveal
          as="ul"
          variant="stagger"
          stagger={0.12}
          on="load"
          delay={0.85}
          className="mx-auto mt-10 grid w-full max-w-[42rem] gap-3 sm:grid-cols-3"
        >
          {capabilities.cards.map((capability) => {
            const Icon = iconFor(capability.icon);
            return (
              <li
                key={capability.title}
                data-reveal-item
                className="border border-inverse-surface-1 bg-inverse-canvas p-4 text-left"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center bg-inverse-surface-1 text-white">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <h2 className="mt-3 text-sm font-semibold text-white">{capability.title}</h2>
                <p className="mt-1 text-[0.72rem] leading-relaxed text-inverse-ink-muted">{capability.description}</p>
              </li>
            );
          })}
        </Reveal>

        <Reveal as="div" on="load" variant="fade-up" delay={1.2} className="mt-10">
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {hero.primary?.href ? (
              <Link
                href={hero.primary.href}
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-champagne px-6 py-3 text-sm font-normal uppercase tracking-wide text-navy transition-colors hover:bg-champagne-hover active:scale-[0.98]"
              >
                {hero.primary.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
            {hero.secondary?.href ? (
              <Link
                href={hero.secondary.href}
                className="inline-flex min-h-11 items-center justify-center border border-white px-6 py-3 text-sm font-normal uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-ink active:scale-[0.98]"
              >
                {hero.secondary.label}
              </Link>
            ) : null}
          </div>
          <p className="mt-6 text-xs text-white/50">
            {hero.footnote}
          </p>
        </Reveal>
      </div>

      {/* Unmissable status ticker — outlined type, seamless compositor-only loop */}
      <div aria-hidden className="relative border-t border-inverse-surface-1 bg-inverse-canvas py-4">
        <div className="overflow-hidden">
          <div className="ticker-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {TICKER_ITEMS.map((_, index) => (
                  <span
                    key={index}
                    className="mx-6 whitespace-nowrap text-2xl font-semibold uppercase tracking-[0.3em] text-transparent sm:text-3xl"
                    style={{ WebkitTextStroke: "1px rgba(255,255,255,0.22)" }}
                  >
                    Coming Soon <span className="mx-4 text-champagne/40" style={{ WebkitTextStroke: "0" }}>•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
