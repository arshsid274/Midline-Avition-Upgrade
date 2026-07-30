import Image from "next/image";
import Link from "next/link";
import Reveal from "@/app/components/motion/Reveal";

const sustainabilityPoints = [
  "Carbon-neutral flight operations roadmap",
  "Next-gen SAF adoption partnerships",
];

export default function ContactSustainabilityInnovationSection() {
  return (
    <section className="mt-12 bg-white pb-2 pt-5 sm:mt-14 sm:pt-6">
      <Reveal as="div" variant="fade-up" className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 text-sm text-ink-muted">
          <span aria-hidden className="h-px w-8 bg-ink-subtle" />
          Future Forward
          <span aria-hidden className="h-px w-8 bg-ink-subtle" />
        </p>
        <h2 className="font-display mt-3 text-[2rem] font-light text-ink sm:text-[2.2rem]">
          Sustainability &amp; Innovation
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-[0.7rem] leading-[1.7] text-ink-muted sm:text-[0.72rem]">
          Pioneering a cleaner sky with next-generation technology and our conscious commitments.
        </p>
      </Reveal>

      <Reveal
        as="div"
        variant="clip-wipe"
        duration={0.9}
        className="relative mt-6 overflow-hidden border border-hairline sm:mt-7"
      >
        <div className="relative aspect-[16/7.6] min-h-[245px] sm:min-h-[310px]">
          <Image
            src="/assets/images/aircraft/g450-exterior.webp"
            alt="Gulfstream G450 on the tarmac under a clear blue sky"
            fill
            sizes="(max-width: 1024px) 100vw, 85vw"
            className="object-cover object-[center_62%]"
          />

          <article className="absolute left-4 right-4 top-4 z-10 border border-inverse-surface-1 bg-inverse-canvas p-4 text-white sm:left-10 sm:right-auto sm:top-8 sm:max-w-[20.5rem] sm:p-5">
            <h3 className="text-lg font-medium tracking-tight text-white">Eco-Conscious Travel</h3>
            <p className="mt-2 text-[0.66rem] leading-[1.65] text-inverse-ink-muted">
              We are committed to reducing our environmental footprint through disciplined Carbon Offsetting and
              measured adoption of Sustainable Aviation Fuel (SAF).
            </p>
            <ul className="mt-3 space-y-1.5">
              {sustainabilityPoints.map((point) => (
                <li key={point} className="flex items-start gap-2 text-[0.66rem] leading-[1.6] text-inverse-ink-muted">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-ibm-blue" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="mt-4 inline-flex items-center gap-2 text-xs font-normal text-white transition-colors hover:text-inverse-ink-muted"
            >
              Learn About Our Green Initiative
              <span aria-hidden>&rarr;</span>
            </Link>
          </article>
        </div>
      </Reveal>
    </section>
  );
}
