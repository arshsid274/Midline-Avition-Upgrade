import Image from "next/image";
import Link from "next/link";
import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";
import { SERVICE_HEROES, type ServiceHero } from "@/lib/service-content";

export default function AircraftCharterHeroComponent({ hero = SERVICE_HEROES["charter-page"] }: { hero?: ServiceHero } = {}) {
  return (
    <section className="relative flex min-h-[88svh] items-center justify-center overflow-hidden">
      <Image
        src={hero.image.src}
        alt={hero.image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/45" />

      <Reveal
        as="div"
        className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center sm:px-6"
        on="load"
        variant="stagger"
        stagger={0.12}
        delay={0.1}
      >
        <span data-reveal-item className="mb-6 inline-flex items-center gap-3 text-sm text-inverse-ink-muted">
          <span aria-hidden className="h-px w-8 bg-white/60" />
          {hero.eyebrow}
          <span aria-hidden className="h-px w-8 bg-white/60" />
        </span>
        <SplitHeading as="h1" mode="lcp" on="load" delay={0.25} className="mb-6 text-5xl font-light tracking-tight text-white sm:text-6xl md:text-7xl">{hero.heading}</SplitHeading>
        <p data-reveal-item className="mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-white/90 md:text-2xl">
          {hero.body}
        </p>
        <div data-reveal-item className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {hero.primary?.href ? (
            <Link
              href={hero.primary.href}
              className="midline-btn-primary w-full px-10 py-4 text-center text-sm sm:w-auto"
            >
              {hero.primary.label}
            </Link>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
