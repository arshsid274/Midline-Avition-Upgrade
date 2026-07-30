import type { Metadata } from "next";
import { buildBreadcrumbSchema, buildPageMetadata, CONTACT_EMAIL, SITE_URL } from "@/lib/seo";
import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";
import { type FaqGroup } from "@/lib/faq-content";
import { getFaqContent } from "@/lib/cms/faq";

// Q&A copy sourced from the ops information-request workbook (Jul 2026).
// The "what if Midline cancels / flight disruption" answer is marked
// NEEDS REWRITE by ops and is intentionally not published yet.

export const revalidate = false;

export const metadata: Metadata = buildPageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers on booking lead times, payment methods, all-inclusive pricing, cancellation tiers, pets and smoking policies, catering, transfers, and the Dubai FBOs Midline Aviation uses.",
  path: "/faq",
  keywords: [
    "private jet charter FAQ",
    "private jet Dubai questions",
    "charter cancellation policy",
    "private jet payment methods",
  ],
});

const breadcrumbSchema = buildBreadcrumbSchema([{ name: "FAQ", path: "/faq" }]);


/** Built from CMS content so the structured data cannot drift from the page. */
const buildFaqSchema = (groups: FaqGroup[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/faq#faq`,
  mainEntity: groups.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))
  ),
});

export default async function FaqPage() {
  const content = await getFaqContent();
  const faqSchema = buildFaqSchema(content.groups);

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── Hero ── */}
      <section className="bg-inverse-canvas px-4 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-16 lg:px-16">
        <div className="mx-auto w-full max-w-[900px]">
          <Reveal as="div" on="load" variant="stagger" stagger={0.12}>
            <p data-reveal-item className="text-sm text-inverse-ink-muted">
              FAQ
            </p>
            <SplitHeading
              as="h1"
              mode="lcp"
              on="load"
              className="font-display mt-4 text-4xl font-light leading-[1.1] text-white sm:text-5xl"
            >
              {content.hero.heading}
            </SplitHeading>
            <p data-reveal-item className="mt-5 max-w-2xl text-base leading-8 text-inverse-ink-muted">
              {content.hero.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Q&A groups ── */}
      <section className="px-4 py-14 sm:px-6 sm:py-18 lg:px-16">
        <div className="mx-auto w-full max-w-[900px]">
          {content.groups.map((group, gi) => (
            <Reveal as="div" variant="fade-up" key={group.heading} className={gi === 0 ? "" : "mt-12 sm:mt-14"}>
              <h2 className="font-display text-2xl font-light text-ink sm:text-3xl">{group.heading}</h2>
              <div className="mt-5 divide-y divide-hairline border-y border-hairline">
                {group.items.map((item) => (
                  <details key={item.q} className="group py-1">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left [&::-webkit-details-marker]:hidden">
                      <span className="text-base font-semibold text-ink sm:text-lg">{item.q}</span>
                      <span
                        aria-hidden
                        className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-hairline text-ibm-blue transition-transform duration-300 group-open:rotate-45"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <p className="pb-5 pr-12 text-sm leading-7 text-ink-muted sm:text-base sm:leading-8">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </Reveal>
          ))}

          <Reveal as="div" variant="fade-up" className="mt-12 bg-ibm-blue p-7 text-center sm:mt-14 sm:p-9">
            <h2 className="font-display text-2xl font-light text-white">{content.closing.heading}</h2>
            <p className="mt-2 text-sm leading-7 text-white/80 sm:text-base">
              {content.closing.bodyBefore}{" "}
              <a className="font-semibold text-white underline underline-offset-2" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>{" "}
              {content.closing.bodyAfter}
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
