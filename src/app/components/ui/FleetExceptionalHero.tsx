import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";
import FlightPathLine from "@/app/components/ui/FlightPathLine";
import { FLEET_PAGE } from "@/lib/fleet-page-content";

export default function FleetExceptionalHero({
  content = FLEET_PAGE.hero,
}: {
  content?: { heading: string; body: string; videoUrl: string; poster: { src: string; alt: string } };
} = {}) {
  return (
    <section className="relative isolate h-[calc(100svh-72px)] w-full overflow-hidden md:h-[calc(100svh-84px)]">
      <div className="relative h-full w-full">
        {/* Real Midline G200 showcase reel. The poster (a small WebP still) paints
            instantly for a fast LCP; the muted looping video streams in behind it. */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={content.poster.src}
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src={content.videoUrl} type="video/mp4" />
        </video>
        {/* Navy-tone overlay (client brief): keeps the headline readable over
            busy footage while staying on-brand. */}
        <div className="absolute inset-0 bg-navy/50" />

        <Reveal
          as="div"
          on="load"
          variant="stagger"
          stagger={0.12}
          delay={0.1}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <SplitHeading
            as="h1"
            mode="lcp"
            on="load"
            delay={0.25}
            className="font-display text-3xl leading-[1.18] text-offwhite sm:text-4xl md:text-5xl"
          >
            {content.heading}
          </SplitHeading>
          <p data-reveal-item className="mt-5 max-w-2xl text-base leading-relaxed text-offwhite/90 sm:text-lg">
            {content.body}
          </p>
          <div data-reveal-item className="mt-6">
            <FlightPathLine />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
