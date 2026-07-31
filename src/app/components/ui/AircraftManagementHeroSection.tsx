import Image from "next/image";
import Link from "next/link";
import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";
import { SERVICE_HEROES, type ServiceHero } from "@/lib/service-content";

export default function AircraftManagementHeroSection({ hero = SERVICE_HEROES["management-page"] }: { hero?: ServiceHero } = {}) {
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
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

      <Reveal
        as="div"
        className="relative mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 text-center"
        on="load"
        variant="stagger"
        stagger={0.12}
        delay={0.1}
      >
        <p
          data-reveal-item
          className="inline-flex items-center gap-2 border border-white/30 bg-black/50 px-4 py-1.5 text-sm text-white"
        >
          {hero.eyebrow}
        </p>

        <SplitHeading
          as="h1"
          mode="lcp"
          on="load"
          delay={0.25}
          className="font-display mt-5 text-4xl font-light leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl"
        >
          {hero.heading}
          {hero.headingAccent ? (
            <>
              {" "}
              <span className="bg-white px-2 py-0.5 text-ink">{hero.headingAccent}</span>
            </>
          ) : null}
          {hero.headingRest}
        </SplitHeading>

        <p
          data-reveal-item
          className="mt-5 max-w-3xl text-sm leading-relaxed text-white/88 sm:text-base md:text-lg"
        >
          {hero.body}
        </p>

        {/*
          These were <button> elements with no handler and no destination —
          they looked like calls to action and did nothing when clicked. Now
          real links, with their labels and targets coming from the CMS.
        */}
        <div data-reveal-item className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          {hero.primary?.href ? (
            <Link
              href={hero.primary.href}
              className="inline-flex min-h-11 items-center justify-center bg-ibm-blue px-6 py-3 text-sm font-normal text-white transition-colors hover:bg-ibm-blue-hover"
            >
              {hero.primary.label}
            </Link>
          ) : null}
          {hero.secondary?.href ? (
            <Link
              href={hero.secondary.href}
              className="inline-flex min-h-11 items-center justify-center border border-white px-6 py-3 text-sm font-normal text-white transition-colors hover:bg-white/10"
            >
              {hero.secondary.label}
            </Link>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
