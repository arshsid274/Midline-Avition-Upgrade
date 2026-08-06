import Image from "next/image";
import Reveal from "@/app/components/motion/Reveal";
import { iconFor } from "@/lib/icons";
import { SERVICE_STANDARDS, type ServiceStandards } from "@/lib/service-content";

const FALLBACK = SERVICE_STANDARDS["management-page"] as ServiceStandards;

/**
 * The band with two points, a tall picture and the figure over it.
 *
 * Content defaults to the built-in constant, so this renders identically
 * whether the CMS is populated, empty, or unreachable.
 */
export default function AircraftManagementStandardsSection({
  content = FALLBACK,
}: {
  content?: ServiceStandards;
} = {}) {
  return (
    <section className="bg-inverse-canvas py-14 sm:py-16 lg:py-20">
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)] lg:gap-16 lg:px-8">
        <Reveal as="div" className="max-w-[38rem] space-y-7" variant="stagger" stagger={0.14}>
          <div data-reveal-item>
            <p className="text-sm text-inverse-ink-muted">
              {content.eyebrow}
            </p>
            <h2
              className="font-display mt-3 max-w-[30rem] text-4xl font-light leading-[1.02] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.15rem]"
            >
              {content.heading}
              {content.headingAccent ? (
                <span className="font-light italic text-inverse-ink-muted">
                  {content.headingAccent}
                </span>
              ) : null}
            </h2>
          </div>

          <p data-reveal-item className="max-w-[33rem] text-base leading-relaxed text-inverse-ink-muted">
            {content.intro}
          </p>

          <div className="space-y-4">
            {content.cards.map((item) => {
              const Icon = iconFor(item.icon);
              return (
                <article
                  key={item.title}
                  data-reveal-item
                  className="max-w-[32rem] bg-inverse-surface-1 p-4"
                >
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-9 w-9 items-center justify-center bg-champagne text-navy">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-[0.82rem] leading-relaxed text-inverse-ink-muted">{item.description}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>

        <Reveal
          as="figure"
          variant="clip-wipe"
          duration={0.9}
          className="relative isolate mx-auto w-full max-w-[30rem] overflow-hidden border border-inverse-surface-1"
        >
          <div className="relative aspect-[4/5] min-h-[420px]">
            <Image
              src={content.image.src}
              alt={content.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 460px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/18 to-transparent" />
          </div>
          <figcaption className="absolute bottom-4 right-4 border border-inverse-surface-1 bg-inverse-canvas px-4 py-3 text-white">
            <p className="text-3xl font-light leading-none text-white">{content.figureValue}</p>
            <p className="mt-1 text-xs text-inverse-ink-muted">
              {content.figureLabel}
            </p>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
