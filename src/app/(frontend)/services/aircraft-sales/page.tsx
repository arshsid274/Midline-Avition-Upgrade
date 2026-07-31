import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  ClipboardCheck,
  FileSearch,
  Handshake,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { buildBreadcrumbSchema, buildPageMetadata, buildServiceSchema } from "@/lib/seo";
import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";
import { getServicePage } from "@/lib/cms/service";
import { iconFor } from "@/lib/icons";

export const revalidate = false;

export const metadata: Metadata = buildPageMetadata({
  title: "Aircraft Sales and Acquisition",
  description:
    "Expert aircraft sales and acquisition guidance with transparent advisory and global market insight.",
  path: "/services/aircraft-sales",
  keywords: ["aircraft sales", "aircraft acquisition", "business aviation brokerage"],
  ogImage: "/assets/og/og-sales.jpg",
});

const serviceSchema = buildServiceSchema({
  name: "Aircraft Sales and Acquisition",
  serviceType: "Aircraft Sales & Acquisition",
  description:
    "Expert aircraft sales and acquisition guidance with transparent advisory and global market insight.",
  path: "/services/aircraft-sales",
  images: ["/assets/og/og-sales.jpg"],
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Aircraft Sales", path: "/services/aircraft-sales" },
]);

export default async function AircraftSalesPage() {
  const { hero, intro, showcase, chips, closing } = await getServicePage("sales-page");

  return (
    <main className="midline-page bg-white text-ink">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="relative min-h-[calc(100svh-72px)] overflow-hidden md:min-h-[calc(100svh-84px)]">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          sizes="100vw"
          className="object-cover hero-kenburns"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/38 via-black/24 to-black/70" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,22,22,0.64)_0%,rgba(22,22,22,0.28)_48%,rgba(22,22,22,0.62)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-[1440px] flex-col justify-end px-4 pb-12 pt-32 sm:px-6 md:min-h-[calc(100svh-84px)] lg:px-16 lg:pb-16">
          <Reveal
            as="div"
            on="load"
            variant="stagger"
            stagger={0.12}
            delay={0.1}
            className="max-w-4xl"
          >
            <p data-reveal-item className="text-sm text-inverse-ink-muted">{hero.eyebrow}</p>
            <SplitHeading
              as="h1"
              mode="lcp"
              on="load"
              delay={0.25}
              className="font-display mt-4 text-4xl font-light leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {hero.heading}
              {hero.headingAccent ? (
                <> <span className="text-ibm-blue">{hero.headingAccent}</span></>
              ) : null}
              {hero.headingRest}
            </SplitHeading>
            <p data-reveal-item className="mt-5 max-w-2xl text-base leading-8 text-white/86 sm:text-lg">
              {hero.body}
            </p>
            <div data-reveal-item className="mt-8 flex flex-col gap-3 sm:flex-row">
              {hero.primary?.href ? (
                <Link
                  href={hero.primary.href}
                  className="inline-flex items-center justify-center gap-2 bg-ibm-blue px-5 py-3 text-sm font-normal uppercase tracking-wide text-white transition-[background-color,transform] duration-150 ease-out hover:bg-ibm-blue-hover active:scale-[0.98]"
                >
                  {hero.primary.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
              {hero.secondary?.href ? (
                <Link
                  href={hero.secondary.href}
                  className="inline-flex items-center justify-center border border-white px-5 py-3 text-sm font-normal uppercase tracking-wide text-white transition-[background-color,transform] duration-150 ease-out hover:bg-white/10 active:scale-[0.98]"
                >
                  {hero.secondary.label}
                </Link>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-16">
        <Reveal
          as="div"
          variant="stagger"
          stagger={0.14}
          className="mx-auto grid w-full max-w-[1180px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"
        >
          <div data-reveal-item>
            <p className="text-sm text-ink-muted">{intro?.eyebrow}</p>
            <h2 className="font-display mt-3 text-3xl font-light text-ink sm:text-5xl">
              {intro?.heading}
            </h2>
          </div>
          <div data-reveal-item className="space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
              {(intro?.paragraphs ?? []).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
        </Reveal>
      </section>

      {showcase.cards.map((section, index) => {
        const Icon = iconFor(section.icon);
        const reverse = index % 2 === 1;
        return (
          <section
            key={section.title}
            className={`px-4 py-14 sm:px-6 sm:py-20 lg:px-16 ${
              index % 2 === 0 ? "bg-surface-1" : "bg-white"
            }`}
          >
            <div
              className="mx-auto grid w-full max-w-[1280px] gap-8 lg:grid-cols-12 lg:items-center"
            >
              <Reveal
                as="div"
                variant={reverse ? "fade-right" : "fade-left"}
                className={`lg:col-span-5 ${reverse ? "lg:col-start-8 lg:order-2" : "lg:col-start-2"}`}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center bg-ink text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-6 text-sm text-ink-muted">{section.badge}</p>
                <h2 className="font-display mt-3 text-3xl font-light text-ink sm:text-4xl">
                  {section.title}
                </h2>
                <div className="mt-6 h-px w-12 bg-ibm-blue" />
                <div className="mt-7 space-y-5 text-base leading-7 text-ink-muted">
                  {(section.description ?? "").split("\n\n").filter(Boolean).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>

              <div className={`lg:col-span-6 ${reverse ? "lg:order-1" : ""}`}>
                <Reveal
                  as="figure"
                  variant="clip-wipe"
                  duration={0.9}
                  className="relative aspect-[1.55] overflow-hidden border border-hairline bg-surface-1"
                >
                  <Image
                    src={section.image.src}
                    alt={section.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 52vw"
                    className="object-cover transition-transform duration-500 ease-out hover:scale-[1.035]"
                  />
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-16">
        <div className="mx-auto w-full max-w-[1180px]">
          <Reveal as="div" variant="fade-up" className="mx-auto max-w-3xl text-center">
            <p className="text-sm text-ink-muted">{chips?.eyebrow}</p>
            <h2 className="font-display mt-3 text-3xl font-light text-ink sm:text-5xl">
              {chips?.heading}
            </h2>
            <p className="mt-5 text-base leading-8 text-ink-muted">
              {chips?.intro}
            </p>
          </Reveal>

          <Reveal
            as="div"
            variant="stagger"
            stagger={0.08}
            className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {(chips?.chips ?? []).map((service) => {
              const Icon = iconFor(service.icon);
              return (
                <div
                  key={service.label}
                  data-reveal-item
                  className="flex min-h-20 items-center gap-3 border border-hairline bg-white px-4 py-4"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center bg-surface-1 text-ibm-blue">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="text-sm font-semibold text-ink">{service.label}</span>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-16">
        <Reveal
          as="div"
          variant="fade-up"
          className="mx-auto flex w-full max-w-[1180px] flex-col items-start gap-8 border border-inverse-surface-1 bg-inverse-canvas p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12"
        >
          <div className="max-w-xl">
            <p className="text-sm text-inverse-ink-muted">{closing?.eyebrow}</p>
            <h2 className="font-display mt-3 text-3xl font-light text-white sm:text-4xl">
              {closing?.heading}
            </h2>
            <p className="mt-4 text-base leading-7 text-inverse-ink-muted">
                {closing?.body}
            </p>
          </div>
          {closing?.cta?.href ? (
            <Link
              href={closing.cta.href}
            className="inline-flex shrink-0 items-center justify-center gap-2 bg-ibm-blue px-7 py-4 text-sm font-normal uppercase tracking-wide text-white transition-[background-color,transform] duration-150 ease-out hover:bg-ibm-blue-hover active:scale-[0.98]"
            >
              {closing.cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </Reveal>
      </section>
    </main>
  );
}
