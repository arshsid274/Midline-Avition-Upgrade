import type { Jet } from "@/lib/fleet";
import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";
import AutoplayVideo from "@/app/components/motion/AutoplayVideo";

export default function JetVerticalShowcase({ jet }: { jet: Jet }) {
  if (!jet.verticalVideo) return null;
  const { src, poster, heading, caption } = jet.verticalVideo;

  return (
    <section
      aria-label={`${jet.name} video tour`}
      className="overflow-hidden bg-surface-1 py-16 sm:py-20"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:px-8">
        <div>
          <Reveal as="p" variant="fade-up" className="text-sm text-ink-muted">
            Cabin Tour
          </Reveal>
          <SplitHeading
            as="h2"
            className="font-display mt-3 text-3xl font-light leading-[1.08] tracking-[-0.02em] text-ink sm:text-4xl lg:text-[2.9rem]"
          >
            {heading}
          </SplitHeading>
          <Reveal as="p" variant="fade-up" className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
            {caption}
          </Reveal>

          <Reveal as="dl" variant="stagger" stagger={0.1} className="mt-9 grid max-w-md grid-cols-3 gap-6">
            {jet.specs.slice(0, 3).map((spec) => (
              <div key={spec.label} data-reveal-item className="border-l border-hairline pl-3">
                <dt className="text-xs text-ink-muted">
                  {spec.label}
                </dt>
                <dd className="mt-1 text-xl font-semibold text-ink">
                  {spec.displayValue ?? `${spec.value.toLocaleString("en-US")}${spec.unit ? ` ${spec.unit}` : ""}`}
                </dd>
              </div>
            ))}
          </Reveal>
        </div>

        {/* Phone-framed vertical reel — 9x16 as a feature, not a compromise. */}
        <Reveal as="div" variant="fade-up" className="mx-auto w-full max-w-[320px] lg:max-w-[340px]">
          <div className="relative overflow-hidden border-[6px] border-ink bg-ink">
            <div className="relative aspect-[9/16] max-h-[70svh] w-full overflow-hidden">
              <AutoplayVideo
                src={src}
                poster={poster}
                className="absolute inset-0 h-full w-full object-cover"
                aria-label={`${jet.name} cabin walkthrough video`}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
