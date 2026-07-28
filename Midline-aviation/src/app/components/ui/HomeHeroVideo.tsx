import Link from "next/link";
import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";

/**
 * Home hero — same treatment as the fleet page's exceptional-fleet hero
 * (FleetExceptionalHero): a muted looping showcase reel with a poster for
 * fast LCP, dark gradient scrim, and a left-aligned Carbon-style headline.
 * Replaces the old scroll-scrubbed image-sequence hero (AircraftScroll).
 */
export default function HomeHeroVideo() {
  return (
    <section className="relative isolate h-[calc(100svh-72px)] w-full overflow-hidden md:h-[calc(100svh-84px)]">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/assets/images/aircraft/g200-exterior.webp"
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src="/assets/videos/g200-showcase.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

      <div className="relative mx-auto flex h-full w-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-8">
        <Reveal
          as="div"
          className="max-w-[38rem] text-left text-white"
          on="load"
          variant="stagger"
          stagger={0.12}
          delay={0.1}
        >
          <span data-reveal-item className="text-sm text-white/80">
            Established Excellence
          </span>

          <SplitHeading
            as="h1"
            mode="lcp"
            on="load"
            delay={0.25}
            className="font-display mt-5 text-4xl font-light leading-[1.12] tracking-[-0.02em] sm:text-5xl md:text-[3.4rem]"
          >
            Midline Aviation
            <br />
            <span className="text-ibm-blue">Your Sky.</span> Your Schedule. Your Way.
          </SplitHeading>

          <span aria-hidden data-reveal-item className="mt-6 block h-px w-14 bg-ibm-blue" />

          <p data-reveal-item className="mt-6 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
            Refining the art of private travel with bespoke charters from Dubai. Available to the
            discerning explorer 24/7.
          </p>

          <Link
            data-reveal-item
            href="/#book-your-flight"
            className="mt-8 inline-flex min-h-12 items-center bg-ibm-blue px-6 py-3 text-sm text-white uppercase tracking-wide transition-colors hover:bg-ibm-blue-hover"
          >
            Book Flight
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
