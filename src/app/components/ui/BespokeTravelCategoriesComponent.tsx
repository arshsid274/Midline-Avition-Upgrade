import Image from "next/image";
import Link from "next/link";
import Reveal from "@/app/components/motion/Reveal";
import { SERVICE_SHOWCASES, type ServiceSection, type ShowcaseCard } from "@/lib/service-content";

/**
 * The three tall picture cards on the charter page.
 *
 * Content defaults to SERVICE_SHOWCASES, so this renders identically whether or
 * not a caller passes anything — the same arrangement as WhyChooseUsComponent,
 * and for the same reason.
 *
 * A card with no image is skipped rather than rendered: next/image throws on an
 * empty src, and drafts skip required-field validation, so a half-finished card
 * would otherwise take down the whole page.
 */
export default function BespokeTravelCategoriesComponent({
  content = SERVICE_SHOWCASES["charter-page"],
}: {
  content?: ServiceSection<ShowcaseCard>;
} = {}) {
  const cards = content.cards.filter((card) => card.image?.src);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-10">
      <Reveal as="h2" variant="fade-up" className="mb-12 text-center text-3xl font-light text-ink">
        {content.heading}
      </Reveal>
      <Reveal as="div" variant="stagger" stagger={0.1} className="grid gap-8 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            data-reveal-item
            className="group relative h-[500px] overflow-hidden border border-hairline bg-white"
          >
            <Image
              src={card.image.src}
              alt={card.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/34 to-transparent" />
            <div className="absolute bottom-0 left-0 p-10">
              <h3 className="mb-4 text-2xl font-normal text-white">{card.title}</h3>
              {card.description ? (
                <p className="mb-6 text-white/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {card.description}
                </p>
              ) : null}
              {card.link?.href ? (
                <Link
                  href={card.link.href}
                  className="inline-flex items-center gap-2 font-normal text-white transition-colors hover:text-inverse-ink-muted"
                >
                  {card.link.label}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  );
}
