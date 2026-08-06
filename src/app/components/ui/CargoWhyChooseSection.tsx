import Reveal from "@/app/components/motion/Reveal";
import { iconFor } from "@/lib/icons";
import { SERVICE_FEATURES, type FeatureCard, type ServiceSection } from "@/lib/service-content";

const FALLBACK = SERVICE_FEATURES["cargo-page"] as ServiceSection<FeatureCard>;

/**
 * The three cards with bullet points.
 *
 * `featured` outlines a card and adds a note beneath it. It is a content
 * decision — which advantage to lead with — so it lives in the CMS, while what
 * "featured" looks like stays here.
 */
export default function CargoWhyChooseSection({
  content = FALLBACK,
}: {
  content?: ServiceSection<FeatureCard>;
} = {}) {
  return (
    <section className="bg-inverse-canvas py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal as="div" variant="fade-up" className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
          <p className="text-sm text-inverse-ink-muted">{content.eyebrow}</p>
          <h2
            className="font-display mt-3 text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.6rem]"
          >
            {content.heading}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-inverse-ink-muted sm:text-base">
            {content.intro}
          </p>
        </Reveal>

        {/* Cards grid */}
        <Reveal as="div" variant="stagger" stagger={0.12} className="grid gap-5 md:grid-cols-3">
          {content.cards.map((item) => {
            const Icon = iconFor(item.icon);
            return (
              <article
                key={item.title}
                data-reveal-item
                className={`relative overflow-hidden border p-6 transition-colors ${
                  item.featured
                    ? "border-champagne bg-inverse-surface-1"
                    : "border-inverse-surface-1 bg-inverse-surface-1 hover:border-ink-subtle"
                }`}
              >
                <span
                  className={`relative inline-flex h-12 w-12 items-center justify-center ${
                    item.featured ? "bg-champagne text-navy" : "bg-inverse-canvas text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="relative mt-5 text-xl font-normal text-white">{item.title}</h3>
                <p className="relative mt-2.5 text-sm leading-relaxed text-inverse-ink-muted">{item.description}</p>

                <ul className="relative mt-5 space-y-2.5">
                  {(item.points ?? []).map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-inverse-ink-muted">
                      <span aria-hidden className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {item.featured && (
                  <div className="relative mt-6 border-t border-white/10 pt-4">
                    <p className="text-xs text-inverse-ink-muted">
                      Industry-leading standard
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
