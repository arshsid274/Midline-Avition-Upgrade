import Link from "next/link";
import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";
import { HOME_HERO, type HeroContent } from "@/lib/home-content";

/**
 * Home hero — same treatment as the fleet page's exceptional-fleet hero
 * (FleetExceptionalHero): a muted looping showcase reel with a poster for
 * fast LCP, dark gradient scrim, and a left-aligned Carbon-style headline.
 * Replaces the old scroll-scrubbed image-sequence hero (AircraftScroll).
 *
 * Content is CMS-driven. The default keeps this rendering unchanged until the
 * Home Page global is wired in, and is deleted once it is.
 */
type HomeHeroVideoProps = {
  content?: HeroContent;
};

export default function HomeHeroVideo({ content = HOME_HERO }: HomeHeroVideoProps) {
  const { eyebrow, heading, body, cta, videoUrl, poster } = content;

  return (
    <section className="relative isolate h-[calc(100svh-72px)] w-full overflow-hidden md:h-[calc(100svh-84px)]">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={poster.src}
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src={videoUrl} type="video/mp4" />
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
            {eyebrow}
          </span>

          {/*
            Keyed on its own content so a live-preview router.refresh() remounts
            the heading rather than reconciling against the DOM that GSAP's
            SplitText has already rewritten — that reconciliation throws
            removeChild, or renders the new text inside a stale mask (i.e.
            invisibly). The key is constant in production, so nothing changes
            there.
          */}
          <SplitHeading
            key={`${heading.line1}|${heading.accent}|${heading.rest}`}
            as="h1"
            mode="lcp"
            on="load"
            delay={0.25}
            className="font-display mt-5 text-4xl font-light leading-[1.12] tracking-[-0.02em] sm:text-5xl md:text-[3.4rem]"
          >
            {heading.line1}
            <br />
            <span className="text-ibm-blue">{heading.accent}</span> {heading.rest}
          </SplitHeading>

          <span aria-hidden data-reveal-item className="mt-6 block h-px w-14 bg-ibm-blue" />

          <p data-reveal-item className="mt-6 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
            {body}
          </p>

          <Link
            data-reveal-item
            href={cta.href}
            className="mt-8 inline-flex min-h-12 items-center bg-ibm-blue px-6 py-3 text-sm text-white uppercase tracking-wide transition-colors hover:bg-ibm-blue-hover"
          >
            {cta.label}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
