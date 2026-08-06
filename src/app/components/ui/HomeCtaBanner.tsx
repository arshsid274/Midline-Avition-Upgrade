import Link from "next/link";
import { HOME_CTA_BANNER, type CtaBannerContent } from "@/lib/home-content";

/**
 * Full-bleed deep-navy band just above the footer, with the champagne primary
 * CTA — the closing beat of the dark-led homepage rhythm (client brief §2).
 *
 * Content is CMS-driven. The default keeps this rendering unchanged until the
 * Home Page global is wired in, and is deleted once it is.
 */
type HomeCtaBannerProps = {
  content?: CtaBannerContent;
};

export default function HomeCtaBanner({ content = HOME_CTA_BANNER }: HomeCtaBannerProps) {
  return (
    <section aria-labelledby="home-cta-heading" className="border-t border-champagne/20 bg-navy">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <h2
            id="home-cta-heading"
            className="text-2xl text-offwhite sm:text-3xl"
          >
            {content.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-base text-inverse-ink-muted">
            {content.body}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href={content.primary.href}
            className="inline-flex min-h-12 items-center bg-champagne px-6 py-3 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-navy transition-colors hover:bg-champagne-hover"
          >
            {content.primary.label}
          </Link>
          <Link
            href={content.secondary.href}
            className="inline-flex min-h-12 items-center border border-offwhite/40 px-6 py-3 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-offwhite transition-colors hover:border-champagne hover:text-champagne"
          >
            {content.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
