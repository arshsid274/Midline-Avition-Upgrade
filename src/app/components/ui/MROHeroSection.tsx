import Image from "next/image";
import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";

export default function MROHeroSection() {
  return (
    <section className="relative isolate h-[calc(100svh-72px)] w-full overflow-hidden md:h-[calc(100svh-84px)]">
      <Image
        src="/assets/images/aircraft/g450-nose.webp"
        alt="Gulfstream G450 head-on during ground handling at the Midline facility"
        fill
        sizes="100vw"
        className="object-cover object-center hero-kenburns"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

      <div className="relative mx-auto flex h-full w-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-8">
        <Reveal
          as="div"
          className="max-w-[36rem] text-left text-white"
          on="load"
          variant="stagger"
          stagger={0.12}
          delay={0.1}
        >
          <p
            data-reveal-item
            className="inline-flex items-center gap-2.5 text-sm text-inverse-ink-muted"
          >
            <span aria-hidden className="h-px w-8 bg-ibm-blue" />
            Century of Excellence
          </p>

          <SplitHeading
            as="h1"
            mode="lcp"
            on="load"
            delay={0.25}
            className="font-display mt-4 text-4xl font-light leading-[1.02] tracking-[-0.02em] sm:text-5xl md:text-6xl"
          >
            Maintenance,
            <br />
            <span className="text-ibm-blue">Repair &amp; Overhaul</span>
          </SplitHeading>

          <p
            data-reveal-item
            className="mt-4 max-w-[32rem] text-sm leading-relaxed text-white/82 sm:text-base"
          >
            The gold standard in aviation excellence. Experience the perfect blend of technical precision and luxury
            service in our state-of-the-art facilities.
          </p>

          <div data-reveal-item className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center bg-ibm-blue px-6 py-3 text-sm font-normal text-white transition-colors hover:bg-ibm-blue-hover"
            >
              View Capabilities
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center border border-white px-6 py-3 text-sm font-normal text-white transition-colors hover:bg-white hover:text-ink"
            >
              Download Brochure
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
