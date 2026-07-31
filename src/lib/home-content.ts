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

export type ShowcaseItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  ctaLabel: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
};

export const SHOWCASE_ITEMS: ShowcaseItem[] = [] = [
  {
    id: "private-charter",
    title: "Private Charter",
    subtitle: "Elite travel management",
    description:
      "Indulge in seamless luxury with our VIP private charter service, where we manage every detail from A to Z, creating an exclusive journey tailored to perfection just for you.",
    href: "/services/aircraft-charter",
    ctaLabel: "Explore Charter",
    imageSrc: "/assets/images/aircraft/g450-red-carpet.webp",
    imageAlt: "Red carpet rolled out to a waiting private charter jet",
  },
  {
    id: "concierge-service",
    title: "Concierge Service",
    subtitle: "VIP luxury and prestigious experience",
    description:
      "Benefit from the power of access provided by Midline Concierge. From luxury hotel reservations and entertainment to the finest yachts and villas around the globe.",
    href: "/contact",
    ctaLabel: "Contact Concierge",
    imageSrc: "/assets/images/aircraft/concierge.webp",
    imageAlt: "Luxury concierge arrival with chauffeur and luggage handling",
    reverse: true,
  },
];

export type DestinationCard = {
  id: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
};

export const POPULAR_DESTINATIONS: DestinationCard[] = [] = [
  {
    id: "london",
    name: "London",
    imageSrc: "/assets/images/frequent-travel-destinations/london.webp",
    imageAlt: "London skyline along the Thames",
    href: "/contact",
  },
  {
    id: "paris",
    name: "Paris",
    imageSrc: "/assets/images/frequent-travel-destinations/paris.webp",
    imageAlt: "Paris cityscape with the Eiffel Tower",
    href: "/contact",
  },
  {
    id: "maldives",
    name: "Maldives",
    imageSrc: "/assets/images/frequent-travel-destinations/maldives.webp",
    imageAlt: "Maldives island resort from above",
    href: "/contact",
  },
  {
    id: "singapore",
    name: "Singapore",
    imageSrc: "/assets/images/frequent-travel-destinations/singapore.webp",
    imageAlt: "Singapore skyline and waterfront",
    href: "/contact",
  },
  {
    id: "turkey",
    name: "Turkey",
    imageSrc: "/assets/images/frequent-travel-destinations/turkey.webp",
    imageAlt: "Historic skyline of Istanbul, Turkey",
    href: "/contact",
  },
  {
    id: "madrid",
    name: "Madrid",
    imageSrc: "/assets/images/frequent-travel-destinations/madrid.webp",
    imageAlt: "Madrid city architecture at golden hour",
    href: "/contact",
  },
  {
    id: "uzbekistan",
    name: "Uzbekistan",
    imageSrc: "/assets/images/frequent-travel-destinations/uzbekistan.webp",
    imageAlt: "Historic architecture of Uzbekistan",
    href: "/contact",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    imageSrc: "/assets/images/frequent-travel-destinations/mumbai.webp",
    imageAlt: "Mumbai skyline along Marine Drive",
    href: "/contact",
  },
  {
    id: "chennai",
    name: "Chennai",
    imageSrc: "/assets/images/frequent-travel-destinations/chennai.webp",
    imageAlt: "Chennai cityscape and coastline",
    href: "/contact",
  },
];

export type AircraftCard = {
  id: string;
  name: string;
  registration: string;
  description: string;
  comingSoon?: boolean;
  imageSrc: string;
  imageAlt: string;
  href: string;
  videoSrc?: string;
};

export const HOME_AIRCRAFT: AircraftCard[] = [] = [
  {
    id: "legacy-650",
    name: "Embraer Legacy 650",
    registration: "T7-MIDB",
    description:
      "The flagship of luxury aviation delivers ultra-long-range performance, cutting-edge design, and unmatched speed. The Embraer Legacy 650 redefines private air travel with elegance and power.",
    imageSrc: "/assets/images/aircraft/legacy650-exterior-2.webp",
    imageAlt: "Embraer Legacy 650 (T7-MIDB) on the tarmac",
    href: "/fleet/embraer-legacy-650",
  },
  {
    id: "g450",
    name: "Gulfstream G450",
    registration: "T7-MID",
    description:
      "A long-range business jet known for its advanced technology, quiet cabin, and superior reliability. Perfect for intercontinental travel with unmatched comfort and safety.",
    imageSrc: "/assets/images/aircraft/g450-exterior.webp",
    imageAlt: "Gulfstream G450 (T7-MID) on the tarmac",
    href: "/fleet/gulfstream-g450",
  },
  {
    id: "g200",
    name: "Gulfstream G200",
    registration: "T7-MIDA",
    description:
      "A versatile midsize jet offering exceptional comfort and performance for regional and medium-haul flights. The G200 combines spacious seating with impressive range and efficiency.",
    imageSrc: "/assets/images/aircraft/g200-exterior.webp",
    imageAlt: "Gulfstream G200 (T7-MIDA) on the tarmac",
    href: "/fleet/gulfstream-g200",
  },
];

/* ── "Where We Fly" ───────────────────────────────────────────────────────────
 * The map section's copy and the two photographs per aircraft.
 *
 * Lifted out of FlightMarketplaceHero.tsx because that file is "use client" and
 * imports gsap and embla — the seed script runs under plain Node and cannot
 * import it. Route geometry, tail numbers and cabin specs stay in the component:
 * they are flight data, not marketing copy, and the admin says so.
 * ────────────────────────────────────────────────────────────────────────── */

/** The join key between a CMS row and the route data held in code. */
export type JetVisualKey = "gulfstream-heavy" | "gulfstream-mid-size" | "embraer-heavy";

export type JetVisual = {
  aircraft: JetVisualKey;
  title: string;
  exterior: ImageContent;
  interior: ImageContent;
};

export type MarketplaceContent = {
  eyebrow: string;
  heading: string;
  intro: string;
  jetVisuals: JetVisual[];
};

export const MARKETPLACE: MarketplaceContent = {
  eyebrow: "Live Marketplace",
  heading: "Regional private jet routes, split view booking and map intelligence",
  intro:
    "View active route deals in the carousel and follow each selected route on the interactive map, optimized for short-to-mid-range regional flights.",
  jetVisuals: [
    {
      aircraft: "gulfstream-heavy",
      title: "Gulfstream G450",
      exterior: {
        src: "/assets/images/aircraft/g450-exterior.webp",
        alt: "Gulfstream G450 T7-MID on the ramp",
      },
      interior: {
        src: "/assets/images/aircraft/g450-cabin-wide.webp",
        alt: "Gulfstream G450 luxury cabin interior",
      },
    },
    {
      aircraft: "gulfstream-mid-size",
      title: "Gulfstream G200",
      exterior: {
        src: "/assets/images/aircraft/g200-exterior.webp",
        alt: "Gulfstream G200 T7-MIDA on the tarmac",
      },
      interior: {
        src: "/assets/images/aircraft/g200-cabin.webp",
        alt: "Gulfstream G200 cabin interior",
      },
    },
    {
      aircraft: "embraer-heavy",
      title: "Embraer Legacy 650",
      exterior: {
        src: "/assets/images/aircraft/legacy650-exterior.webp",
        alt: "Embraer Legacy 650 T7-MIDB on the tarmac",
      },
      interior: {
        src: "/assets/images/aircraft/legacy650-cabin-real.webp",
        alt: "Embraer Legacy 650 interior cabin",
      },
    },
  ],
};
