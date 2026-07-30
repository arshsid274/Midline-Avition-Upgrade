import type { Metadata } from "next";
import { BadgeCheck, FileCheck2, ShieldCheck, Users, Wrench } from "lucide-react";
import { buildBreadcrumbSchema, buildPageMetadata, CONTACT_EMAIL } from "@/lib/seo";
import { getEnabledMemberships } from "@/lib/cms/accreditations";
import { getSafetyContent } from "@/lib/cms/safety";
import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";

// Copy sourced from the ops information-request workbook (Jul 2026).
// Fields the workbook marks [PENDING] (AOC number/dates, insurance limit,
// Part 145 standard, pilot minimums, WYVERN level) are intentionally omitted —
// add them here once ops confirms; do not scaffold empty labels.

/** Icons for the maintenance tiles, by position. */
const MAINTENANCE_ICONS = [Wrench, FileCheck2, Users];

export const revalidate = false;

export const metadata: Metadata = buildPageMetadata({
  title: "Safety & Certifications",
  description:
    "How Midline Aviation flights are operated: Titan Aviation AOC (San Marino registry), IS-BAO standard operations, comprehensive liability insurance, and maintained, current-CofA aircraft.",
  path: "/safety",
  keywords: [
    "private jet safety Dubai",
    "IS-BAO charter operator",
    "Titan Aviation AOC",
    "private charter certifications",
  ],
});

const breadcrumbSchema = buildBreadcrumbSchema([{ name: "Safety & Certifications", path: "/safety" }]);



export default async function SafetyPage() {
  const [enabledMemberships, content] = await Promise.all([
    getEnabledMemberships(),
    getSafetyContent(),
  ]);

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ── Hero ── */}
      <section className="bg-inverse-canvas px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:px-16">
        <div className="mx-auto w-full max-w-[1180px]">
          <Reveal as="div" on="load" variant="stagger" stagger={0.12}>
            <p data-reveal-item className="text-sm text-inverse-ink-muted">
              {content.hero.eyebrow}
            </p>
            <SplitHeading
              key={content.hero.heading}
              as="h1"
              mode="lcp"
              on="load"
              className="font-display mt-4 max-w-3xl text-4xl font-light leading-[1.1] text-white sm:text-5xl"
            >
              {content.hero.heading}
            </SplitHeading>
            <p data-reveal-item className="mt-5 max-w-2xl text-base leading-8 text-inverse-ink-muted">
              {content.hero.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Operator status ── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-16">
        <Reveal
          as="div"
          variant="stagger"
          stagger={0.14}
          className="mx-auto grid w-full max-w-[1180px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
        >
          <div data-reveal-item>
            <p className="text-sm text-ink-muted">{content.operator.eyebrow}</p>
            <h2 className="font-display mt-3 text-3xl font-light text-ink sm:text-4xl">
              {content.operator.heading}
            </h2>
          </div>
          <div data-reveal-item>
            <p className="text-base leading-8 text-ink-muted sm:text-lg">
              {content.operator.body}
            </p>
            <dl className="mt-8 grid gap-3 sm:grid-cols-3">
              {content.operator.facts.map((fact) => (
                <div key={fact.label} className="border border-hairline bg-surface-1 p-4">
                  <dt className="text-xs text-ink-muted">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold leading-snug text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      {/* ── Safety ratings & audits ── */}
      <section className="bg-surface-1 px-4 py-16 sm:px-6 sm:py-20 lg:px-16">
        <div className="mx-auto w-full max-w-[1180px]">
          <Reveal as="div" variant="fade-up" className="max-w-3xl">
            <p className="text-sm text-ink-muted">
              {content.ratings.eyebrow}
            </p>
            <h2 className="font-display mt-3 text-3xl font-light text-ink sm:text-4xl">
              {content.ratings.heading}
            </h2>
          </Reveal>
          <Reveal
            as="div"
            variant="fade-up"
            className="mt-8 flex flex-col items-start gap-6 border border-hairline bg-white p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8"
          >
            <span className="inline-flex h-14 w-14 flex-none items-center justify-center bg-ibm-blue text-white">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-ink">{content.ratings.cardTitle}</h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-7 text-ink-muted sm:text-base">
{content.ratings.cardBody}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Memberships & affiliations — kept separate from ratings ── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-16">
        <div className="mx-auto w-full max-w-[1180px]">
          <Reveal as="div" variant="fade-up" className="max-w-3xl">
            <p className="text-sm text-ink-muted">
              {content.memberships.eyebrow}
            </p>
            <h2 className="font-display mt-3 text-3xl font-light text-ink sm:text-4xl">
              {content.memberships.heading}
            </h2>
          </Reveal>
          <Reveal as="div" variant="stagger" stagger={0.1} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enabledMemberships.map((m) => (
              <div
                key={m.key}
                data-reveal-item
                className="flex items-center gap-5 border border-hairline bg-surface-1 p-5"
              >
                <span className="flex h-16 w-24 flex-none items-center justify-center border border-hairline bg-white px-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.src} alt={m.name} loading="lazy" className="h-10 w-20 object-contain" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{m.shortName}</p>
                  <p className="mt-0.5 text-xs leading-5 text-ink-muted">{m.name}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Insurance ── */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-16">
        <Reveal
          as="div"
          variant="fade-up"
          className="mx-auto flex w-full max-w-[1180px] flex-col items-start gap-6 border border-inverse-surface-1 bg-inverse-canvas p-7 sm:flex-row sm:items-center sm:gap-8 sm:p-10"
        >
          <span className="inline-flex h-14 w-14 flex-none items-center justify-center bg-ibm-blue text-white">
            <BadgeCheck className="h-7 w-7" />
          </span>
          <div>
            <p className="text-sm text-inverse-ink-muted">Insurance</p>
            <p className="mt-2 max-w-3xl text-base leading-8 text-inverse-ink-muted sm:text-lg">
              All flights are covered by comprehensive liability insurance arranged through Gallagher.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Maintenance & crew ── */}
      <section className="bg-surface-1 px-4 py-16 sm:px-6 sm:py-20 lg:px-16">
        <div className="mx-auto w-full max-w-[1180px]">
          <Reveal as="div" variant="fade-up" className="max-w-3xl">
            <p className="text-sm text-ink-muted">
              Maintenance &amp; Crew
            </p>
            <h2 className="font-display mt-3 text-3xl font-light text-ink sm:text-4xl">
              {content.maintenance.heading}
            </h2>
            <p className="mt-5 text-base leading-8 text-ink-muted">
              {content.maintenance.body}
            </p>
          </Reveal>
          <Reveal as="div" variant="stagger" stagger={0.1} className="mt-8 grid gap-4 sm:grid-cols-3">
            {content.maintenance.facts.map(({ label, value }, index) => {
              const Icon = MAINTENANCE_ICONS[index] ?? Wrench;
              return (
              <div key={label} data-reveal-item className="border border-hairline bg-white p-5">
                <span className="inline-flex h-10 w-10 items-center justify-center bg-ibm-blue/10 text-ibm-blue">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-xs text-ink-muted">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug text-ink">{value}</p>
              </div>
            );
            })}
          </Reveal>
        </div>
      </section>

      {/* ── Contact band ── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-16">
        <Reveal as="div" variant="fade-up" className="mx-auto w-full max-w-[1180px] text-center">
          <h2 className="font-display text-2xl font-light text-ink sm:text-3xl">
            {content.questions.heading}
          </h2>
          <p className="mt-3 text-base leading-8 text-ink-muted">
            Write to <a className="font-semibold text-ibm-blue transition-colors hover:text-ibm-blue-60" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{" "}
            — we are happy to walk you through our operating arrangements before you fly.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
