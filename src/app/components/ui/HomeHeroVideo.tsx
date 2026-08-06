import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";
import FlightPathLine from "@/app/components/ui/FlightPathLine";
import { HOME_HERO, type HeroContent } from "@/lib/home-content";

/**
 * Home hero — centered, minimal treatment matching the fleet page hero
 * (client review, Aug 2026): a muted looping showcase reel behind a deep-navy
 * overlay, one short Cinzel headline in warm off-white, one line of support
 * copy, and the champagne flight-path line. No eyebrow and no hero CTA — the
 * nav "Request Quote" button and the booking form below carry the action.
 *
 * The heading renders in a single colour by design: `accent`/`rest` are kept
 * for the CMS field structure but are never tinted, so stale CMS content
 * cannot reintroduce a mixed-colour headline.
 */
type HomeHeroVideoProps = {
  content?: HeroContent;
};

export default function HomeHeroVideo({ content = HOME_HERO }: HomeHeroVideoProps) {
  const { heading, body, videoUrl, poster } = content;
  const secondLine = [heading.accent, heading.rest].filter(Boolean).join(" ");

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
      {/* Navy-tone overlay (client brief §4 / fleet-hero screenshot): keeps the
          headline readable over busy footage while staying on-brand. */}
      <div className="absolute inset-0 bg-navy/50" />

      <Reveal
        as="div"
        on="load"
        variant="stagger"
        stagger={0.12}
        delay={0.1}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      >
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
          className="font-display text-3xl leading-[1.18] text-offwhite sm:text-4xl md:text-5xl"
        >
          {heading.line1}
          {secondLine ? (
            <>
              <br />
              {secondLine}
            </>
          ) : null}
        </SplitHeading>

        <p
          data-reveal-item
          className="mt-5 max-w-xl text-base leading-relaxed text-offwhite/90 sm:text-lg"
        >
          {body}
        </p>

        <div data-reveal-item className="mt-6">
          <FlightPathLine />
        </div>
      </Reveal>
    </section>
  );
}
