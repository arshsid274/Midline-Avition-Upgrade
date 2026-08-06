import { CheckCircle2 } from "lucide-react";
import Reveal from "@/app/components/motion/Reveal";
import { iconFor } from "@/lib/icons";
import { SERVICE_FEATURES, type FeatureCard, type ServiceSection } from "@/lib/service-content";

const FALLBACK = SERVICE_FEATURES["management-page"] as ServiceSection<FeatureCard>;

/**
 * The three cards with bullet points.
 *
 * CheckCircle2 stays imported directly: it is the bullet glyph, the same on
 * every point, not a per-card choice an editor makes.
 *
 * `points` is optional because drafts skip required-field validation, so a
 * half-finished card can arrive with no array at all.
 */
export default function AircraftManagementSafetyCardsSection({
  content = FALLBACK,
}: {
  content?: ServiceSection<FeatureCard>;
} = {}) {
  return (
    <section className="bg-inverse-canvas py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal as="div" variant="fade-up" className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <p className="text-sm text-inverse-ink-muted">{content.eyebrow}</p>
          <h2
            className="font-display mt-3 text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-inverse-ink-muted sm:text-base">
            {content.intro}
          </p>
        </Reveal>

        <Reveal as="div" variant="stagger" stagger={0.12} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {content.cards.map((card) => {
            const Icon = iconFor(card.icon);
            return (
              <article
                key={card.title}
                data-reveal-item
                className="border border-inverse-surface-1 bg-inverse-surface-1 p-6 transition-colors hover:border-ink-subtle"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center bg-champagne text-navy">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-xl font-normal text-white">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-inverse-ink-muted">{card.description}</p>

                <ul className="mt-5 space-y-2.5">
                  {(card.points ?? []).map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-inverse-ink-muted">
                      <CheckCircle2 className="mt-[0.1rem] h-4 w-4 shrink-0 text-white" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
