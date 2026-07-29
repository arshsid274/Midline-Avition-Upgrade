import Link from "next/link";
import { HOME_CTA_BANNER, type CtaBannerContent } from "@/lib/home-content";

/**
 * Carbon `cta-banner` (DESIGN-ibm.md): the one full-bleed IBM Blue panel in
 * the page rhythm, sitting just above the dark footer. Flat #0f62fe, square
 * corners, headline-size type at light weight — the single loudest use of the
 * brand accent on the page.
 *
 * Content is CMS-driven. The default keeps this rendering unchanged until the
 * Home Page global is wired in, and is deleted once it is.
 */
type HomeCtaBannerProps = {
  content?: CtaBannerContent;
};

export default function HomeCtaBanner({ content = HOME_CTA_BANNER }: HomeCtaBannerProps) {
  return (
    <section aria-labelledby="home-cta-heading" className="bg-ibm-blue">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <h2
            id="home-cta-heading"
            className="text-3xl font-light tracking-tight text-white sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-3 max-w-2xl text-base text-white/80">
            {content.body}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href={content.primary.href}
            className="inline-flex min-h-12 items-center bg-white px-4 py-3 text-sm text-ibm-blue uppercase tracking-wide transition-colors hover:bg-surface-1"
          >
            {content.primary.label}
          </Link>
          <Link
            href={content.secondary.href}
            className="inline-flex min-h-12 items-center border border-white px-4 py-3 text-sm text-white uppercase tracking-wide transition-colors hover:bg-white hover:text-ibm-blue"
          >
            {content.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
