import Image from "next/image";
import { Package, ArrowRight } from "lucide-react";
import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";

export default function CargoHeroSection() {
  return (
    <section className="relative isolate h-[calc(100svh-72px)] w-full overflow-hidden md:h-[calc(100svh-84px)]">
      <Image
        src="/assets/images/aircraft/cargo-hero.webp"
        alt="Gulfstream G450 T7-MID on the ramp at night under apron floodlights, ready for cargo operations"
        fill
        sizes="100vw"
        className="object-cover object-center hero-kenburns"
        priority
      />

      {/* Layered overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

      <div className="relative mx-auto flex h-full w-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-8">
        <Reveal
          as="div"
          className="max-w-[40rem] text-left text-white"
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
            Global Logistics Experts
          </span>

          {/* Heading */}
          <SplitHeading
            as="h1"
            mode="lcp"
            on="load"
            delay={0.25}
            className="font-display mt-5 text-4xl font-light leading-[1.06] tracking-[-0.02em] sm:text-5xl md:text-[3.6rem]"
          >
            Reliable Air Cargo
            <br />
            <span className="text-ibm-blue">Solutions</span> For Business
          </SplitHeading>

          {/* Body */}
          <p
            data-reveal-item
            className="mt-5 max-w-[34rem] text-sm leading-relaxed text-white/78 sm:text-base"
          >
            Experience seamless global logistics with Midline Aviation&rsquo;s end-to-end cargo network. Precision
            handling, real-time tracking, and guaranteed delivery windows for every shipment.
          </p>

          {/* Stats row */}
          <div
            data-reveal-item
            className="mt-7 flex flex-wrap items-center gap-6 border-t border-white/14 pt-6"
          >
            {[
              { value: "180+", label: "Destinations" },
              { value: "99.4%", label: "On-Time Rate" },
              { value: "24/7", label: "Operations" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-light text-ibm-blue">{stat.value}</p>
                <p className="text-xs text-inverse-ink-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div data-reveal-item className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-ibm-blue px-6 py-3 text-sm font-normal text-white transition-colors hover:bg-ibm-blue-hover"
            >
              Explore Services
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center border border-white px-6 py-3 text-sm font-normal text-white transition-colors hover:bg-white hover:text-ink"
            >
              Track Shipment
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
