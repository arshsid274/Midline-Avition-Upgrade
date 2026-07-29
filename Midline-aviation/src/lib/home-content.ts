/**
 * Home page content, lifted out of the components verbatim.
 *
 * This module exists for two reasons:
 *
 * 1. It is the seed source. scripts/seed/home-page.mts imports it directly
 *    rather than parsing JSX, so every word of copy and every alt string is
 *    carried into the CMS exactly as written — nothing is retyped and nothing
 *    is lost. Same trick src/lib/accreditations.ts enabled for the logos.
 * 2. It lets each section component take a content prop while defaulting to
 *    these values, so the site renders identically before and after the CMS is
 *    wired up. Once a section reads from Payload the default is deleted.
 *
 * Headings are split into line1 / accent / rest because the rendered H1 carries
 * an inline blue <span> and a <br>. Keeping those as separate fields means the
 * structure survives editing — see src/payload/fields/heading.ts.
 */

export type HeadingParts = {
  line1: string;
  /** Rendered in Midline blue at the start of the second line. */
  accent: string;
  rest: string;
};

export type LinkContent = {
  label: string;
  href: string;
};

export type ImageContent = {
  src: string;
  alt: string;
};

export type HeroContent = {
  eyebrow: string;
  heading: HeadingParts;
  body: string;
  cta: LinkContent;
  /** Static file on R2 — videos are not Payload uploads. */
  videoUrl: string;
  poster: ImageContent;
};

export type CtaBannerContent = {
  heading: string;
  body: string;
  primary: LinkContent;
  secondary: LinkContent;
};

export const HOME_HERO: HeroContent = {
  eyebrow: "Established Excellence",
  heading: {
    line1: "Midline Aviation",
    accent: "Your Sky.",
    rest: "Your Schedule. Your Way.",
  },
  body: "Refining the art of private travel with bespoke charters from Dubai. Available to the discerning explorer 24/7.",
  cta: {
    label: "Book Flight",
    href: "/#book-your-flight",
  },
  videoUrl: "/assets/videos/g200-showcase.mp4",
  poster: {
    src: "/assets/images/aircraft/g200-exterior.webp",
    // The poster is the LCP element — it needs real alt text, which the raw
    // <video poster> attribute never had.
    alt: "Gulfstream G200 on the apron at golden hour",
  },
};

export const HOME_CTA_BANNER: CtaBannerContent = {
  heading: "Plan your next flight",
  body: "Charter, management, sales, MRO, and cargo — one team, available 24/7 from Dubai.",
  primary: {
    label: "Book a flight",
    href: "/#book-your-flight",
  },
  secondary: {
    label: "Contact us",
    href: "/contact",
  },
};
