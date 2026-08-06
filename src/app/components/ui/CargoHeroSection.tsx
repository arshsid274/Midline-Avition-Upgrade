import Image from "next/image";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";
import { SERVICE_HEROES, type ServiceHero } from "@/lib/service-content";

export default function CargoHeroSection({ hero = SERVICE_HEROES["cargo-page"] }: { hero?: ServiceHero } = {}) {
  return (
    <section className="relative isolate h-[calc(100svh-72px)] w-full overflow-hidden md:h-[calc(100svh-84px)]">
      <Image
        src={hero.image.src}
        alt={hero.image.alt}
        fill
        sizes="100vw"
        className="object-cover object-center hero-kenburns"
        priority
      />

      {/* Layered overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/50 via-navy/20 to-transparent" />

      <div className="relative mx-auto flex h-full w-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-8">
        <Reveal
          as="div"
          className="max-w-[40rem] text-left text-offwhite"
          on="load"
          variant="stagger"
          stagger={0.12}
          delay={0.1}
        >
          {/* Badge */}
          <span
            data-reveal-item
            className="inline-flex items-center gap-2.5 text-sm text-inverse-ink-muted"
          >
            <Package className="h-3 w-3" />
            {hero.eyebrow}
          </span>

          {/* Heading */}
          <SplitHeading
            as="h1"
            mode="lcp"
            on="load"
            delay={0.25}
            className="font-display mt-5 text-4xl font-light leading-[1.06] tracking-[-0.02em] sm:text-5xl md:text-[3.6rem]"
          >
            {hero.heading}
            {hero.headingAccent ? (
              <>
                <br />
                <span className="text-champagne">{hero.headingAccent}</span>
              </>
            ) : null}
            {hero.headingRest}
          </SplitHeading>

          {/* Body */}
          <p
            data-reveal-item
            className="mt-5 max-w-[34rem] text-sm leading-relaxed text-white/78 sm:text-base"
          >
            {hero.body}
          </p>

          {/* Stats row */}
          <div
            data-reveal-item
            className="mt-7 flex flex-wrap items-center gap-6 border-t border-white/14 pt-6"
          >
            {(hero.stats ?? []).map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-light text-champagne">{stat.value}</p>
                <p className="text-xs text-inverse-ink-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div data-reveal-item className="mt-7 flex flex-col gap-3 sm:flex-row">
            {/* Were <button> elements with no destination — real links now. */}
            {hero.primary?.href ? (
              <Link
                href={hero.primary.href}
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-champagne px-6 py-3 text-sm font-normal text-navy transition-colors hover:bg-champagne-hover"
              >
                {hero.primary.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
            {hero.secondary?.href ? (
              <Link
                href={hero.secondary.href}
                className="inline-flex min-h-11 items-center justify-center border border-white px-6 py-3 text-sm font-normal text-white transition-colors hover:bg-white hover:text-ink"
              >
                {hero.secondary.label}
              </Link>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
