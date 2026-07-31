import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/app/components/motion/Reveal";
import { SERVICE_SHOWCASES, type ServiceSection, type ShowcaseCard } from "@/lib/service-content";

const FALLBACK = SERVICE_SHOWCASES["cargo-page"] as ServiceSection<ShowcaseCard>;

/**
 * The three picture cards and the figures under them.
 *
 * Two dead controls were removed rather than wired. The section link pointed at
 * "#", and each card's "Learn more" was a <button> with no handler — both
 * looked clickable and did nothing on the live site. The card action is now a
 * real link from the CMS, shown only when a destination exists.
 *
 * Cards without a picture are dropped: next/image throws on an empty src, and
 * on a static page that fails the entire build.
 */
export default function CargoCapabilitiesSection({
  content = FALLBACK,
}: {
  content?: ServiceSection<ShowcaseCard>;
} = {}) {
  const cards = content.cards.filter((card) => card.image?.src);

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
          <Reveal as="div" variant="stagger" stagger={0.14}>
            <p data-reveal-item className="text-sm text-ink-muted">{content.eyebrow}</p>
            <h2
              data-reveal-item
              className="font-display mt-3 text-3xl font-light tracking-[-0.02em] text-ink sm:text-4xl"
            >
              {content.heading}
            </h2>
            <p data-reveal-item className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
              {content.intro}
            </p>
          </Reveal>
        </div>

        {/* Image cards grid */}
        <Reveal as="div" variant="stagger" stagger={0.12} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((op) => (
            <article
              key={op.title}
              data-reveal-item
              className="group relative overflow-hidden border border-hairline"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={op.image.src}
                  alt={op.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/24 to-transparent" />

                {/* Tag badge */}
                <span className="absolute left-4 top-4 bg-ink px-3 py-1 text-xs text-white">
                  {op.badge}
                </span>

                {/* Title on image */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-2xl font-normal text-white">{op.title}</h3>
                </div>
              </div>

              {/* Description panel */}
              <div className="bg-white p-5">
                <p className="text-sm leading-relaxed text-ink-muted">{op.description}</p>
                {op.link?.href ? (
                  <Link
                    href={op.link.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-normal text-ibm-blue underline-offset-4 hover:text-ibm-blue-60 hover:underline"
                >
                  {op.link.label}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                ) : null}
              </div>
            </article>
          ))}
        </Reveal>

        {/* Bottom metrics bar */}
        <div className="mt-12 grid grid-cols-2 gap-4 border border-hairline bg-surface-1 p-6 sm:grid-cols-4 sm:p-8">
          {(content.stats ?? []).map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-light text-ink sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs text-ink-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
