/**
 * Service page content, lifted from the components verbatim.
 * Seed source for the five service globals.
 */

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
