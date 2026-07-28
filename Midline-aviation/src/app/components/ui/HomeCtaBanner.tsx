import Link from "next/link";

/**
 * Carbon `cta-banner` (DESIGN-ibm.md): the one full-bleed IBM Blue panel in
 * the page rhythm, sitting just above the dark footer. Flat #0f62fe, square
 * corners, headline-size type at light weight — the single loudest use of the
 * brand accent on the page.
 */
export default function HomeCtaBanner() {
  return (
    <section aria-labelledby="home-cta-heading" className="bg-ibm-blue">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <h2
            id="home-cta-heading"
            className="text-3xl font-light tracking-tight text-white sm:text-4xl"
          >
            Plan your next flight
          </h2>
          <p className="mt-3 max-w-2xl text-base text-white/80">
            Charter, management, sales, MRO, and cargo — one team, available 24/7 from Dubai.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/#book-your-flight"
            className="inline-flex min-h-12 items-center bg-white px-4 py-3 text-sm text-ibm-blue uppercase tracking-wide transition-colors hover:bg-surface-1"
          >
            Book a flight
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center border border-white px-4 py-3 text-sm text-white uppercase tracking-wide transition-colors hover:bg-white hover:text-ibm-blue"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
