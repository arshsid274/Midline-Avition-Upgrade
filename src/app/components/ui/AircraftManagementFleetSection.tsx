import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/app/components/motion/Reveal";
import { SERVICE_SHOWCASES, type ServiceSection, type ShowcaseCard } from "@/lib/service-content";

const FALLBACK = SERVICE_SHOWCASES["management-page"] as ServiceSection<ShowcaseCard>;

/**
 * The three aircraft cards.
 *
 * A card with no picture is skipped: next/image throws on an empty src, and on
 * a statically generated page that throw fails the whole build, not one card.
 *
 * The "View All Specifications" link stays hardcoded — it is navigation to
 * /fleet, not content someone would edit here.
 */
export default function AircraftManagementFleetSection({
  content = FALLBACK,
}: {
  content?: ServiceSection<ShowcaseCard>;
} = {}) {
  const cards = content.cards.filter((card) => card.image?.src);

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal as="div" variant="fade-up" className="mb-9 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-sm text-ink-muted">{content.eyebrow}</p>
            <h2
              className="font-display mt-2 text-3xl font-light tracking-[-0.02em] text-ink sm:text-4xl"
            >
              {content.heading}
            </h2>
          </div>
          <Link
            href="/fleet"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ibm-blue transition-colors hover:text-ibm-blue-60"
          >
            View All Specifications
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal as="div" variant="stagger" stagger={0.12} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((aircraft) => (
            <article
              key={aircraft.title}
              data-reveal-item
              className="group overflow-hidden border border-hairline bg-white"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={aircraft.image.src}
                  alt={aircraft.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 inline-flex bg-ink px-2 py-1 text-xs font-semibold text-white">
                  {aircraft.badge}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-normal text-ink">{aircraft.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{aircraft.description}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
