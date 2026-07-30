/**
 * Contact page content, lifted from the page component verbatim.
 * Seed source for the Contact Page global — see src/lib/home-content.ts for
 * why these modules exist.
 */

export type ContactDetail = {
  kind: "address" | "email" | "phone" | "hours";
  value: string;
  /** mailto: / tel: target. Plain rows (address, hours) have none. */
  href?: string;
};

export type ContactContent = {
  eyebrow: string;
  heading: string;
  body: string;
  videoUrl: string;
  poster: { src: string; alt: string };
  details: ContactDetail[];
};

export const CONTACT_CONTENT: ContactContent = {
  eyebrow: "Midline Aviation",
  heading: "Let's Plan Your Next Journey",
  body: "Connect with our concierge team for private charter, aircraft management, and bespoke aviation support tailored to your itinerary.",
  videoUrl: "/assets/videos/contact.mp4",
  poster: {
    src: "/assets/images/aircraft/contact-poster.webp",
    alt: "Private jet on the ramp at dusk",
  },
  details: [
    {
      kind: "address",
      value: "Office 213, Building A5, Business Park, Dubai South, UAE",
    },
    {
      kind: "email",
      value: "info@midlineaviation.com",
      href: "mailto:info@midlineaviation.com",
    },
    {
      kind: "phone",
      value: "+971 455 334 30",
      href: "tel:+97145533430",
    },
    {
      kind: "hours",
      value: "24/7 Client Support and Flight Coordination",
    },
  ],
};
