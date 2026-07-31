import Reveal from "@/app/components/motion/Reveal";
import { iconFor } from "@/lib/icons";
import { CHARTER_FEATURES, type ServiceSection, type FeatureCard } from "@/lib/service-content";

/**
 * The row of reasons with pictograms on the charter page.
 *
 * Content defaults to SERVICE_FEATURES so this renders identically whether or
 * not a caller passes anything — which is what lets the CMS be wired in
 * without a visual change, and what keeps the page working if the global is
 * empty. Drafts skip required-field validation, so a card can legitimately
 * arrive with no description and no icon; both are handled rather than assumed.
 */
export default function WhyChooseUsComponent({
  content = CHARTER_FEATURES,
}: {
  content?: ServiceSection<FeatureCard>;
} = {}) {
  return (
    <section className="bg-surface-1 py-24">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <Reveal as="div" variant="fade-up" className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-light text-ink md:text-4xl">{content.heading}</h2>
          <div className="mx-auto h-1 w-20 bg-ibm-blue" />
        </Reveal>

        <Reveal
          as="div"
          variant="stagger"
          stagger={0.12}
          className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5"
        >
          {content.cards.map((card) => {
            const Icon = iconFor(card.icon);
            return (
              <article
                key={card.title}
                data-reveal-item
                className="group border border-hairline bg-white p-8 text-center transition-colors hover:border-ibm-blue"
              >
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-ibm-blue/10 text-ibm-blue transition-transform group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-base font-semibold text-ink">{card.title}</h3>
                {card.description ? (
                  <p className="text-sm leading-relaxed text-ink-muted">{card.description}</p>
                ) : null}
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
