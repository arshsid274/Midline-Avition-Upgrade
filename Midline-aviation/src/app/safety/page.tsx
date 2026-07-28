import type { Metadata } from "next";
import { BadgeCheck, FileCheck2, ShieldCheck, Users, Wrench } from "lucide-react";
import { buildBreadcrumbSchema, buildPageMetadata, CONTACT_EMAIL } from "@/lib/seo";
import { enabledMemberships } from "@/lib/accreditations";
import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";

// Copy sourced from the ops information-request workbook (Jul 2026).
// Fields the workbook marks [PENDING] (AOC number/dates, insurance limit,
// Part 145 standard, pilot minimums, WYVERN level) are intentionally omitted —
// add them here once ops confirms; do not scaffold empty labels.

export const dynamic = "force-static";

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

const operatorFacts = [
  { label: "Registered operator on AOC", value: "Titan Aviation" },
  { label: "Issuing authority", value: "Civil Aviation Authority of San Marino" },
  { label: "Authorisation", value: "Private charter operations" },
];

const maintenanceFacts = [
  { icon: Wrench, label: "Maintenance", value: "Carried out by Titan Aviation" },
  { icon: FileCheck2, label: "Airworthiness", value: "Current Certificates of Airworthiness across the fleet" },
  { icon: Users, label: "Flight crew", value: "Recurrent training programmes" },
];

export default function SafetyPage() {
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
              Safety &amp; Certifications
            </p>
            <SplitHeading
              as="h1"
              mode="lcp"
              on="load"
              className="font-display mt-4 max-w-3xl text-4xl font-light leading-[1.1] text-white sm:text-5xl"
            >
              Safety is the standard, not the amenity.
            </SplitHeading>
            <p data-reveal-item className="mt-5 max-w-2xl text-base leading-8 text-inverse-ink-muted">
              Every Midline Aviation charter is flown under a certificated operator, audited operating
              standards, and comprehensive insurance — here is exactly how our flights are run.
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
            <p className="text-sm text-ink-muted">Operator Status</p>
            <h2 className="font-display mt-3 text-3xl font-light text-ink sm:text-4xl">
              Flown under a certificated operator.
            </h2>
          </div>
          <div data-reveal-item>
            <p className="text-base leading-8 text-ink-muted sm:text-lg">
              Midline Aviation arranges and manages private charter flights operated under the Air
              Operator Certificate (AOC) of Titan Aviation, registered with the Civil Aviation Authority
              of San Marino. The AOC authorises private charter operations.
            </p>
            <dl className="mt-8 grid gap-3 sm:grid-cols-3">
              {operatorFacts.map((fact) => (
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
              Safety Ratings &amp; Audits
            </p>
            <h2 className="font-display mt-3 text-3xl font-light text-ink sm:text-4xl">
              Audited operating standards.
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
              <h3 className="text-lg font-semibold text-ink">IS-BAO</h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-7 text-ink-muted sm:text-base">
                Our operations are conducted to the International Standard for Business Aircraft
                Operations (IS-BAO) — the global benchmark for business aviation safety management.
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
              Memberships &amp; Affiliations
            </p>
            <h2 className="font-display mt-3 text-3xl font-light text-ink sm:text-4xl">
              Part of the business aviation community.
            </h2>
          </Reveal>
          <Reveal as="div" variant="stagger" stagger={0.1} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enabledMemberships.map((m) => (
              <div
                key={m.id}
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
              Maintained aircraft, current crews.
            </h2>
            <p className="mt-5 text-base leading-8 text-ink-muted">
              Aircraft maintenance is carried out by Titan Aviation. All aircraft hold current
              Certificates of Airworthiness, and flight crew complete recurrent training programmes.
            </p>
          </Reveal>
          <Reveal as="div" variant="stagger" stagger={0.1} className="mt-8 grid gap-4 sm:grid-cols-3">
            {maintenanceFacts.map(({ icon: Icon, label, value }) => (
              <div key={label} data-reveal-item className="border border-hairline bg-white p-5">
                <span className="inline-flex h-10 w-10 items-center justify-center bg-ibm-blue/10 text-ibm-blue">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-xs text-ink-muted">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug text-ink">{value}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Contact band ── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-16">
        <Reveal as="div" variant="fade-up" className="mx-auto w-full max-w-[1180px] text-center">
          <h2 className="font-display text-2xl font-light text-ink sm:text-3xl">
            Questions about how we operate?
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
