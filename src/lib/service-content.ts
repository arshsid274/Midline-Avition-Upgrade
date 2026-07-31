/**
 * Service page content, lifted from the components verbatim.
 * Seed source for the five service globals.
 */

import type { IconName } from "./icon-names";

export type ServiceHero = {
  eyebrow: string;
  heading: string;
  headingAccent?: string;
  body: string;
  image: { src: string; alt: string };
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  stats?: { value: string; label: string }[];
};

export const SERVICE_HEROES: Record<string, ServiceHero> = {
  "charter-page": {
    eyebrow: "Premium Charter Experience",
    heading: "Aircraft Charter",
    body: "We value your time and redefine the quality of travel with bespoke aviation solutions.",
    image: { src: "/assets/images/aircraft/g200-cabin.webp", alt: "Gulfstream G200 cabin interior" },
    primary: { label: "Explore Our Fleet", href: "/fleet" },
  },
  "management-page": {
    eyebrow: "Elite Aircraft Management",
    heading: "Peace of Mind",
    body: "Comprehensive aircraft management services tailored to operational excellence, safety, and your schedule.",
    image: {
      src: "/assets/images/aircraft/management-hero.webp",
      alt: "Managed aircraft on the ramp",
    },
    primary: { label: "Explore Our Fleet", href: "/fleet" },
    secondary: { label: "Review Safety Protocols", href: "/safety" },
  },
  "sales-page": {
    eyebrow: "Aircraft Sales",
    heading: "Buy and sell with confidence",
    body: "Confidential advisory across acquisition, sale, and fleet planning — grounded in current market data.",
    image: { src: "/assets/images/aircraft/sales-hero.webp", alt: "Private jet available for sale" },
    primary: { label: "Start a Confidential Inquiry", href: "/contact" },
    secondary: { label: "View Fleet", href: "/fleet" },
  },
  "cargo-page": {
    eyebrow: "Global Logistics Experts",
    heading: "Reliable Air Cargo",
    headingAccent: "For Business",
    body: "Time-critical freight moved with the same precision as our passenger operations.",
    image: { src: "/assets/images/aircraft/cargo-hero.webp", alt: "Cargo being loaded onto an aircraft" },
    primary: { label: "Explore Services", href: "/contact" },
    secondary: { label: "Track Shipment", href: "/contact" },
    stats: [
      { value: "180+", label: "Destinations" },
      { value: "99.4%", label: "On-time delivery" },
      { value: "24-7", label: "Operations desk" },
    ],
  },
  "mro-page": {
    eyebrow: "Aircraft MRO · Maintenance, Repair & Overhaul",
    heading: "Coming Soon",
    body: "Our certified Maintenance, Repair & Overhaul facility is in final preparation.",
    image: { src: "/assets/images/aircraft/g450-nose.webp", alt: "Gulfstream G450 nose detail" },
    primary: { label: "Get Notified at Launch", href: "/contact" },
    secondary: { label: "Explore the Fleet", href: "/fleet" },
  },
};

/* ── Body sections ────────────────────────────────────────────────────────────
 * Lifted verbatim from the section components, which previously held this
 * content themselves and accepted no props. The components now take these as
 * default values, so rendered output is unchanged — while the same constants
 * become the seed source for the globals, and therefore editable.
 * ────────────────────────────────────────────────────────────────────────── */

/** A card led by a pictogram rather than a photograph. */
export type FeatureCard = {
  title: string;
  description?: string;
  icon?: IconName;
  points?: string[];
};

/** A card led by a photograph. */
export type ShowcaseCard = {
  title: string;
  description?: string;
  image: { src: string; alt: string };
  link?: { label: string; href: string };
};

export type ServiceSection<TCard> = {
  eyebrow?: string;
  heading: string;
  intro?: string;
  cards: TCard[];
};

export const SERVICE_FEATURES: Record<string, ServiceSection<FeatureCard>> = {
  "charter-page": {
    heading: "Why Choose Us",
    cards: [
      {
        title: "Absolute Flexibility",
        description: "Fly on your schedule, to any airport worldwide.",
        icon: "calendar-clock",
      },
      {
        title: "Refined Comfort",
        description: "Luxury interiors designed for peak relaxation.",
        icon: "sofa",
      },
      {
        title: "Total Privacy",
        description: "Discreet handling and confidential flight manifests.",
        icon: "shield-check",
      },
      {
        title: "Personalized Attention",
        description: "Your dedicated concierge for every detail.",
        icon: "concierge-bell",
      },
      {
        title: "Global Access",
        description: "Global network of operators and crew.",
        icon: "globe-2",
      },
    ],
  },
};

export const SERVICE_SHOWCASES: Record<string, ServiceSection<ShowcaseCard>> = {
  "charter-page": {
    heading: "Bespoke Travel Categories",
    cards: [
      {
        title: "Corporate Travel",
        description:
          "Enable your executive team to maximize productivity while traveling between international hubs.",
        image: {
          src: "/assets/images/aircraft/g200-lifestyle.webp",
          alt: "Executives working aboard the Gulfstream G200 cabin",
        },
        link: { label: "Learn More", href: "/contact" },
      },
      {
        title: "Leisure Journeys",
        description:
          "Vacation starts at the hangar. Skip the lines and arrive refreshed at your private paradise.",
        image: {
          src: "/assets/images/aircraft/g450-family-dining.webp",
          alt: "Family dining aboard the Gulfstream G450",
        },
        link: { label: "Learn More", href: "/contact" },
      },
      {
        title: "Special Occasions",
        description:
          "Celebrate life milestones with a personalized inflight experience that exceeds expectations.",
        image: {
          src: "/assets/images/aircraft/g450-celebration.webp",
          alt: "Champagne celebration aboard the Gulfstream G450",
        },
        link: { label: "Learn More", href: "/contact" },
      },
    ],
  },
};
