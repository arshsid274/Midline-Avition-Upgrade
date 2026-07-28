import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JETS, type Jet } from "@/lib/fleet";
import Reveal from "@/app/components/motion/Reveal";

export default function JetCrossLinks({ jet }: { jet: Jet }) {
  const siblings = JETS.filter((candidate) => candidate.slug !== jet.slug);

  return (
    <section aria-label="Explore the rest of the fleet" className="bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal as="div" variant="fade-up" className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-light tracking-[-0.02em] text-ink sm:text-4xl">
            The rest of the fleet
          </h2>
          <Link
            href="/fleet"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ibm-blue transition-colors hover:text-ibm-blue-60"
          >
            Compare all aircraft
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal as="div" variant="stagger" stagger={0.12} className="grid gap-5 md:grid-cols-2">
          {siblings.map((sibling) => (
            <Link
              key={sibling.slug}
              href={`/fleet/${sibling.slug}`}
              data-reveal-item
              className="group relative block overflow-hidden border border-hairline"
            >
              <div className="relative aspect-[16/8] overflow-hidden">
                <Image
                  src={sibling.hero.image.src}
                  alt={sibling.hero.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6">
                <div>
                  <p className="text-xs text-white/80">
                    {sibling.category} · {sibling.tail}
                  </p>
                  <h3 className="font-display mt-1 text-2xl font-medium text-white">
                    {sibling.name}
                  </h3>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center border border-white/40 text-white transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </Reveal>

        <Reveal as="div" variant="fade-up" className="mt-12">
          <div className="overflow-hidden bg-ibm-blue p-8 text-white sm:p-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h3 className="font-display text-2xl font-medium sm:text-3xl sm:font-light">
                  Ready to fly {jet.name.split(" ").slice(-1)[0]}?
                </h3>
                <p className="mt-2 max-w-xl text-sm text-white/85">
                  Our charter team confirms availability, routing, and a bespoke cabin service plan within hours.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link
                  href="/services/aircraft-charter"
                  className="inline-flex min-h-11 items-center justify-center border border-white px-6 py-3 text-sm font-normal uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-ibm-blue"
                >
                  Charter Services
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center justify-center gap-2 bg-white px-6 py-3 text-sm font-normal uppercase tracking-wide text-ibm-blue transition-colors hover:bg-surface-1"
                >
                  Request a Quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
