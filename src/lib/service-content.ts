/**
 * Service page content, lifted from the components verbatim.
 * Seed source for the five service globals.
 */

import type { IconName } from "./icon-names";

/**
 * The five service pages, as a closed set.
 *
 * `keyof typeof SERVICE_HEROES` would widen to `string`, because the record is
 * typed `Record<string, …>` — so a mistyped slug compiles and then throws at
 * runtime reading a property of undefined. Naming the union keeps that a
 * compile error, the same way Record<IconName, LucideIcon> does for icons.
 */
export type ServiceSlug =
  | "charter-page"
  | "management-page"
  | "sales-page"
  | "cargo-page"
  | "mro-page";

/**
 * A page header.
 *
 * The heading is three discrete fields rather than one, because every service
 * page styles a run of words differently inside its <h1> — a white chip on
 * management, blue on cargo, blue italic on MRO. Storing markup in the CMS
 * would let an editor break the SplitText reveal; storing three strings lets
 * them change the words while the component keeps deciding how they look.
 *
 *   heading + headingAccent + headingRest
 *   "Expert Care for Your Aircraft," + "Peace of Mind" + " for You"
 */
export type ServiceHero = {
  eyebrow: string;
  heading: string;
  headingAccent?: string;
  headingRest?: string;
  body: string;
  /** MRO only — it runs a second paragraph under the lead. */
  bodySecondary?: string;
  /** MRO only — the trust line beneath the buttons. */
  footnote?: string;
  image: { src: string; alt: string };
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  stats?: { value: string; label: string }[];
};

/**
 * Values here are what the pages RENDER today, copied verbatim.
 *
 * That is a deliberate rule, not an accident of authorship. These constants are
 * both the seed source and the fallback, so at the moment a component starts
 * reading a field, the rendered text, this constant and the database row must
 * already be the same string — otherwise wiring a field silently rewrites live
 * copy with no error anywhere. Several values below were corrected to match the
 * page after a production audit found them disagreeing.
 */
export const SERVICE_HEROES: Record<ServiceSlug, ServiceHero> = {
  "charter-page": {
    eyebrow: "Premium Charter Experience",
    heading: "Aircraft Charter",
    body: "We value your time and redefine the quality of travel with bespoke aviation solutions.",
    image: {
      src: "/assets/images/aircraft/g200-cabin.webp",
      alt: "Gulfstream G200 private jet cabin prepared for charter",
    },
    primary: { label: "Explore Our Fleet", href: "/fleet" },
  },
  "management-page": {
    eyebrow: "Elite Aircraft Management",
    // Rendered as: Expert Care for Your Aircraft, [Peace of Mind] for You
    heading: "Expert Care for Your Aircraft,",
    headingAccent: "Peace of Mind",
    headingRest: " for You",
    body: "Comprehensive aircraft management services tailored to operational excellence, safety, and your schedule.",
    image: {
      src: "/assets/images/aircraft/management-hero.webp",
      alt: "Gulfstream G200 T7-MIDA under management, seen from the Midline FBO lounge",
    },
    primary: { label: "Explore Our Fleet", href: "/fleet" },
    secondary: { label: "Review Safety Protocols", href: "/safety" },
  },
  "sales-page": {
    eyebrow: "Aircraft Sales",
    heading: "Aircraft Sales & Acquisition",
    body: "In-house brokerage and acquisition advisory for clients looking to buy, sell, lease, or reposition premium business and commercial aircraft.",
    image: {
      src: "/assets/images/aircraft/sales-hero.webp",
      alt: "Clients walking to the Gulfstream G200 T7-MIDA on the Midline ramp",
    },
    primary: { label: "Start a Confidential Inquiry", href: "/contact" },
    secondary: { label: "View Fleet", href: "/fleet" },
  },
  "cargo-page": {
    eyebrow: "Global Logistics Experts",
    // Rendered as: Reliable Air Cargo / [Solutions] For Business
    heading: "Reliable Air Cargo",
    headingAccent: "Solutions",
    headingRest: " For Business",
    body: "Experience seamless global logistics with Midline Aviation’s end-to-end cargo network. Precision handling, real-time tracking, and guaranteed delivery windows for every shipment.",
    image: {
      src: "/assets/images/aircraft/cargo-hero.webp",
      alt: "Gulfstream G450 T7-MID on the ramp at night under apron floodlights, ready for cargo operations",
    },
    primary: { label: "Explore Services", href: "/contact" },
    secondary: { label: "Track Shipment", href: "/contact" },
    stats: [
      { value: "180+", label: "Destinations" },
      { value: "99.4%", label: "On-Time Rate" },
      { value: "24/7", label: "Operations" },
    ],
  },
  "mro-page": {
    eyebrow: "Aircraft MRO · Maintenance, Repair & Overhaul",
    // Rendered as: Coming [Soon] — the accent is italic blue inside the h1.
    heading: "Coming",
    headingAccent: "Soon",
    body: "Our certified Maintenance, Repair & Overhaul facility is in final preparation.",
    bodySecondary:
      "The same precision that flies the Midline fleet — OEM-aligned procedures, full traceability, and a 24/7 AOG desk — arriving at Dubai World Central.",
    footnote: "Certified engineers · OEM-aligned procedures · Dubai World Central",
    image: {
      src: "/assets/images/aircraft/g450-nose.webp",
      alt: "Gulfstream G450 head-on during ground handling at the Midline facility",
    },
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
  /** Cargo only — outlines the card and adds the "Industry-leading standard" note. */
  featured?: boolean;
};

/** A card led by a photograph. */
export type ShowcaseCard = {
  title: string;
  description?: string;
  image: { src: string; alt: string };
  link?: { label: string; href: string };
  /**
   * The small label over or above the card. One field serves three pages that
   * each name it differently — management's "Large Jet", cargo's "Priority
   * Freight", sales' "Acquisition Advisory". Same data, different placement;
   * placement is the component's business, so only the admin label varies.
   */
  badge?: string;
  /** Sales only — the advisory blocks lead with a pictogram. */
  icon?: IconName;
};

export type ServiceSection<TCard> = {
  eyebrow?: string;
  heading: string;
  intro?: string;
  cards: TCard[];
  /** Cargo only — the figures below the picture cards. */
  stats?: { value: string; label: string }[];
};

/** Management's "Setting New Standards" band: copy, two cards, a portrait, a figure. */
export type ServiceStandards = {
  eyebrow: string;
  heading: string;
  headingAccent?: string;
  intro: string;
  cards: FeatureCard[];
  image: { src: string; alt: string };
  figureValue: string;
  figureLabel: string;
};

/** A plain two-column band of prose, as on the sales page. */
export type ServiceIntro = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
};

/** A grid of short labelled items — the sales "Comprehensive Services" chips. */
export type ServiceChips = {
  eyebrow: string;
  heading: string;
  intro: string;
  chips: { label: string; icon?: IconName }[];
};

/** The panel directly above the footer. */
export type ServiceClosing = {
  eyebrow: string;
  heading: string;
  body: string;
  cta?: { label: string; href: string };
};

/**
 * Named separately so WhyChooseUsComponent can default to it without a non-null
 * assertion. The records below are Partial — not every page has every section —
 * so `SERVICE_FEATURES["charter-page"]` is legitimately `T | undefined`, and a
 * `!` there would be a lie waiting to become a crash.
 */
export const CHARTER_FEATURES: ServiceSection<FeatureCard> = {
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
};

export const SERVICE_FEATURES: Partial<Record<ServiceSlug, ServiceSection<FeatureCard>>> = {
  "charter-page": CHARTER_FEATURES,

  "management-page": {
    eyebrow: "Operational Core",
    heading: "Safety, Performance, and Technical Control",
    intro:
      "Our management team is structured to protect every mission, every cycle, and every aircraft decision.",
    cards: [
      {
        title: "Safety & Compliance",
        description:
          "Rigorous adherence to international standards with active monitoring and systems that exceed baseline requirements.",
        icon: "shield",
        points: ["24/7 safety hotline", "Fatigue risk management", "Annual third-party audits"],
      },
      {
        title: "Cost Efficiency",
        description:
          "Optimized operating costs through strategic vendor relationships and fleet-level programs across markets.",
        icon: "wallet",
        points: ["Global fuel program", "Group insurance rates", "Vendor audit services"],
      },
      {
        title: "Technical Oversight",
        description:
          "Round-the-clock technical support and maintenance planning to keep every aircraft mission-ready and value-protected.",
        icon: "wrench",
        points: ["CAMP/CMP management", "Pre-buy inspections", "Engine program oversight"],
      },
    ],
  },

  "cargo-page": {
    eyebrow: "Core Advantages",
    heading: "Why Choose Midline Cargo?",
    intro:
      "Built on decades of aviation expertise, our cargo division delivers reliability, security, and precision on every route we operate.",
    cards: [
      {
        title: "Global Reach",
        description:
          "An interconnected logistics network spanning over 180 destinations across six continents — ensuring your cargo moves without borders.",
        icon: "globe",
        points: ["Multi-hub routing", "Regional partner network", "Customs clearance support"],
        featured: false,
      },
      {
        title: "Unmatched Security",
        description:
          "Industry-leading cargo security protocols from point of origin to final delivery. Full chain-of-custody tracking and tamper-evident packaging.",
        icon: "shield-check",
        points: ["End-to-end chain of custody", "24/7 real-time tracking", "Certified secure handling"],
        featured: true,
      },
      {
        title: "Customized Solutions",
        description:
          "Bespoke logistics configurations designed around your cargo type, timeline, and compliance requirements. No two shipments are the same.",
        icon: "sliders",
        points: ["Temperature-sensitive cargo", "Oversized & heavy lift", "Hazmat certified handling"],
        featured: false,
      },
    ],
  },

  // MRO renders these as three tiles with no section header above them, so the
  // heading is carried for the admin's benefit but nothing displays it.
  "mro-page": {
    heading: "Capabilities",
    cards: [
      {
        title: "Maintenance",
        description: "Scheduled line and base programs by certified teams.",
        icon: "clipboard-check",
      },
      {
        title: "Repair",
        description: "Component and systems repair with full traceability.",
        icon: "cog",
      },
      {
        title: "Overhaul",
        description: "Lifecycle programs focused on value and reliability.",
        icon: "shield-alert",
      },
    ],
  },
};

/** Named for the same reason as CHARTER_FEATURES — a typed component default. */
export const CHARTER_SHOWCASE: ServiceSection<ShowcaseCard> = {
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
};

export const SERVICE_SHOWCASES: Partial<Record<ServiceSlug, ServiceSection<ShowcaseCard>>> = {
  "charter-page": CHARTER_SHOWCASE,

  "management-page": {
    eyebrow: "Under Our Wing",
    heading: "Our Management Fleet",
    cards: [
      {
        badge: "Large Jet",
        title: "Gulfstream G450",
        description:
          "Full-service management for the G450 — long-range capability backed by disciplined dispatch and maintenance oversight.",
        image: {
          src: "/assets/images/aircraft/g450-exterior.webp",
          alt: "Gulfstream G450 aircraft",
        },
      },
      {
        badge: "Heavy Jet",
        title: "Embraer Legacy 650",
        description:
          "Heavy-jet management with the cabin space and range for extended business and diplomatic missions.",
        image: {
          src: "/assets/images/aircraft/legacy650-exterior.webp",
          alt: "Embraer Legacy 650 aircraft",
        },
      },
      {
        badge: "Super Midsize",
        title: "Gulfstream G200",
        description:
          "Efficient super-midsize management tuned for regional reach, quick turnarounds, and cost control.",
        image: {
          src: "/assets/images/aircraft/g200-exterior.webp",
          alt: "Gulfstream G200 aircraft",
        },
      },
    ],
  },

  "cargo-page": {
    eyebrow: "Capabilities",
    heading: "Our Operations",
    intro:
      "From express packages to mission-critical oversized freight — Midline Cargo operates across every spectrum of air logistics.",
    cards: [
      {
        badge: "Priority Freight",
        title: "Express Delivery",
        description:
          "Time-critical shipments handled with priority routing, guaranteed delivery windows, and same-day processing at major hubs.",
        image: { src: "/assets/images/aircraft/g200-exterior.webp", alt: "Express Delivery" },
      },
      {
        badge: "Oversized Cargo",
        title: "Heavy Lift",
        description:
          "Oversized and heavy cargo solutions using wide-body freighter capacity with specialized loading equipment and structural engineering support.",
        image: {
          src: "/assets/images/aircraft/legacy650-exterior-rear.webp",
          alt: "Heavy Lift",
        },
      },
      {
        badge: "Sensitive Freight",
        title: "Specialized Cargo",
        description:
          "Hazmat, temperature-sensitive, and high-value cargo handled under strict compliance protocols, with dedicated secure storage and monitoring.",
        image: { src: "/assets/images/aircraft/g450-nose.webp", alt: "Specialized Cargo" },
      },
    ],
    stats: [
      { value: "500+", label: "Tonnes/Day Capacity" },
      { value: "180+", label: "Global Destinations" },
      { value: "48hr", label: "Express Turnaround" },
      { value: "100%", label: "Compliance Rate" },
    ],
  },

  // No section header renders above the sales advisory blocks, so eyebrow and
  // intro are deliberately absent — heading exists only to name the tab.
  // `description` carries two paragraphs separated by a blank line; the mapper
  // splits on it, which avoids a second table for a two-paragraph case.
  "sales-page": {
    heading: "Advisory blocks",
    cards: [
      {
        badge: "Acquisition Advisory",
        title: "Buying an Aircraft",
        icon: "search",
        description:
          "Midline Aviation combines trusted global market access with hands-on technical guidance to source aircraft aligned with your mission profile, budget, and operating expectations.\n\nOur team supports shortlisting, valuation, negotiation, pre-purchase inspection coordination, closing, delivery, and post-acquisition readiness.",
        image: {
          src: "/assets/images/aircraft/g450-nose.webp",
          alt: "Gulfstream G450 head-on, prepared for a client aircraft acquisition",
        },
      },
      {
        badge: "Disposition Strategy",
        title: "Selling an Aircraft",
        icon: "handshake",
        description:
          "Selling an aircraft requires more than a listing. We shape the market story, qualify serious buyers, protect confidentiality, and manage the process through negotiation and final handover.\n\nFrom valuation guidance to targeted exposure, Midline Aviation helps position your aircraft for a confident, transparent transaction.",
        image: {
          src: "/assets/images/aircraft/g450-exterior.webp",
          alt: "Gulfstream G450 on the ramp, positioned for a premium sales campaign",
        },
      },
      {
        badge: "Flexible Ownership",
        title: "Commercial Aircraft & Leasing",
        icon: "plane",
        description:
          "For commercial and corporate operators, we assist with aircraft purchase, sale, lease placement, and market representation across a global network.\n\nOur advisory model is built for flexibility, helping clients evaluate operational needs, ownership structure, aircraft availability, and long-term value.",
        image: {
          src: "/assets/images/aircraft/g200-exterior.webp",
          alt: "Gulfstream G200 supporting commercial aircraft and leasing services",
        },
      },
    ],
  },
};

/** Management's "Setting New Standards" band — a section with no tab until now. */
export const SERVICE_STANDARDS: Partial<Record<ServiceSlug, ServiceStandards>> = {
  "management-page": {
    eyebrow: "The Midline Advantage",
    heading: "Setting New Standards in ",
    headingAccent: "Operational Excellence",
    intro:
      "We provide industry-leading management solutions focused on safety, compliance, and efficiency. Your aircraft is managed by veteran aviation professionals who treat your asset with precision at every step.",
    cards: [
      {
        title: "Global Regulatory Compliance",
        description:
          "Navigating international airspace regulations and audit standards with complete operational clarity.",
        icon: "shield-check",
      },
      {
        title: "Real-time Financial Reporting",
        description:
          "Transparent accounting with structured monthly reporting and cost-control visibility for owners.",
        icon: "line-chart",
      },
    ],
    image: {
      src: "/assets/images/aircraft/g450-exterior-portrait.webp",
      alt: "Managed Gulfstream G450 on the ramp at Dubai",
    },
    figureValue: "99.8%",
    figureLabel: "Dispatch Reliability",
  },
};

/** The sales page's "Market Guidance" two-column band. */
export const SERVICE_INTROS: Partial<Record<ServiceSlug, ServiceIntro>> = {
  "sales-page": {
    eyebrow: "Market Guidance",
    heading: "A guided path through every aircraft transaction.",
    paragraphs: [
      "We provide comprehensive support through each phase of the sale and acquisition process, including market research, sourcing, valuation, buyer qualification, purchasing support, and delivery coordination.",
      "Our aviation specialists bring practical experience across OEMs, cabin classes, ownership models, and operating requirements so clients can move with clarity instead of guesswork.",
    ],
  },
};

/** The sales page's nine-item "Comprehensive Services" grid. */
export const SERVICE_CHIPS: Partial<Record<ServiceSlug, ServiceChips>> = {
  "sales-page": {
    eyebrow: "Comprehensive Services",
    heading: "One advisory team from first review to final handover.",
    intro:
      "Midline Aviation supports new and current aircraft owners with the specialist services needed for a confident transaction.",
    chips: [
      { label: "Aircraft sales and acquisitions", icon: "badge-check" },
      { label: "Aircraft leasing services", icon: "plane" },
      { label: "Aircraft marketing", icon: "sparkles" },
      { label: "Aircraft financing", icon: "banknote" },
      { label: "Ownership structuring", icon: "shield-check" },
      { label: "Pre-purchase inspections", icon: "clipboard-check" },
      { label: "Market research and valuation", icon: "file-search" },
      { label: "Negotiation and closing support", icon: "handshake" },
      { label: "Post-sale transition planning", icon: "badge-check" },
    ],
  },
};

/** The panel above the footer. Only sales renders one. */
export const SERVICE_CLOSINGS: Partial<Record<ServiceSlug, ServiceClosing>> = {
  "sales-page": {
    eyebrow: "Contact Us",
    heading: "Discuss your next aircraft move.",
    body: "Our aviation advisory team handles buying, selling, and leasing conversations with discretion and qualified next actions.",
    cta: { label: "Contact Our Team", href: "/contact" },
  },
};
