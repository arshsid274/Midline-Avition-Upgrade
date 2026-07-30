/**
 * About page content, lifted from the components verbatim.
 * Seed source for the About global.
 */

export type FeatureKey = "charters" | "emptyLegs" | "experiences";

export interface FeatureSlide {
  key: FeatureKey;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition: string;
}

export const featureSlides: FeatureSlide[] = [
  {
    key: "charters",
    label: "Charters",
    eyebrow: "Charters",
    title: "Travel the way you want",
    description:
      "With just a few taps, book private charters for business trips, personal travel, or urgent departures. Access thousands of airports closer to your starting point and arrive with less friction, with dependable service designed around your schedule.",
    ctaHref: "/services/aircraft-charter",
    imageSrc: "/assets/images/aircraft/g450-cabin.webp",
    imageAlt: "Guest relaxing in the Gulfstream G450 cabin",
    imagePosition: "center 40%",
  },
  {
    key: "emptyLegs",
    label: "Empty legs",
    eyebrow: "Empty legs",
    title: "Luxury flights with smarter pricing",
    description:
      "Empty-leg flights happen when aircraft reposition without passengers. That opens access to private aviation at significantly lower rates, while keeping the same premium cabin experience, safety standards, and service quality.",
    ctaHref: "/fleet",
    imageSrc: "/assets/images/aircraft/legacy650-exterior-2.webp",
    imageAlt: "Embraer Legacy 650 repositioning on the ramp",
    imagePosition: "center 50%",
  },
  {
    key: "experiences",
    label: "Experiences",
    eyebrow: "Experiences",
    title: "Go beyond traditional itineraries",
    description:
      "Our curated aviation experiences unlock scenic destinations and unique journeys, from coastal escapes to remote luxury retreats. Every route is crafted to blend seamless flight logistics with memorable, destination-first travel.",
    ctaHref: "/contact",
    imageSrc: "/assets/images/aircraft/g450-celebration.webp",
    imageAlt: "Guests celebrating aboard the Gulfstream G450",
    imagePosition: "center 40%",
  },
];

export interface LeadershipMember {
  name: string;
  title: string;
  bio: string;
  imageSrc: string;
  objectPosition: string;
}

export const leadershipMembers: LeadershipMember[] = [
  {
    name: "Phill",
    title: "Chief Executive Officer",
    bio: "With over 20 years in global air transport, Phill leads Midline with a focus on operational clarity and exceptional client experience.",
    imageSrc: "/assets/images/Team/phill.jpg",
    objectPosition: "center 15%",
  },
  {
    name: "Ryan",
    title: "Head of Partnerships",
    bio: "A finance and commercial strategy lead, Ryan ensures that every collaboration advances mission-ready aviation and long-term growth.",
    imageSrc: "/assets/images/Team/ryan.jpg",
    objectPosition: "center 15%",
  },
  {
    name: "Shar",
    title: "Director of Flight Operations",
    bio: "Shar brings leadership from elite flight teams to elevate our scheduling, safety oversight, and precision-driven service delivery.",
    imageSrc: "/assets/images/Team/shar.jpg",
    objectPosition: "center 15%",
  },
  {
    name: "Amanda",
    title: "Head of Client Experience",
    bio: "Amanda ensures every client interaction reflects Midline's commitment to seamless, personalised service from first inquiry to final landing.",
    imageSrc: "/assets/images/Team/amanda.jpg",
    objectPosition: "center 10%",
  },
];

export const ABOUT_PAGE = {
  whatWeDo: { heading: "What we do" },
  story: {
    heading: "Our story",
    image: {
      src: "/assets/images/aircraft/g200-exterior.webp",
      alt: "Gulfstream G200 on the ramp",
    },
  },
  leadership: {
    eyebrow: "Our Leadership",
    heading: "Meet the Minds Behind Midline",
  },
};

export const ABOUT_STORY = {
  heading: "Our story",
  paragraphs: [
    "Since 2019, Midline has modernized private aviation by making booking more transparent and efficient, with live aircraft availability, clear pricing, and faster confirmations.",
    "Our journey began by supporting regional operators with advanced aviation tools while improving aircraft utilization through shared opportunities and empty-leg visibility.",
    "Today, we serve clients across multiple markets and continue to scale with a clear mission: seamless, reliable, and experience-first private flight.",
  ],
  image: {
    src: "/assets/images/aircraft/g200-exterior.webp",
    alt: "Gulfstream G200 on the ramp",
  },
};

export const ABOUT_SUSTAINABILITY = {
  eyebrow: "Future Forward",
  heading: "Sustainability & Innovation",
  intro:
    "Pioneering a cleaner sky with next-generation technology and our conscious commitments.",
  image: {
    src: "/assets/images/aircraft/g450-exterior.webp",
    alt: "Gulfstream G450 on the tarmac under a clear blue sky",
  },
  cardTitle: "Eco-Conscious Travel",
  cardBody:
    "We are committed to reducing our environmental footprint through disciplined Carbon Offsetting and measured adoption of Sustainable Aviation Fuel.",
  points: [
    "Carbon-neutral flight operations roadmap",
    "Next-gen SAF adoption partnerships",
  ],
  link: { label: "Learn About Our Green Initiative", href: "/contact" },
};

export const ABOUT_LEADERSHIP = {
  eyebrow: "Our Leadership",
  heading: "Meet the Minds Behind Midline",
  intro:
    "We are the one-stop-shop you need to book a business flight, plan a relaxing getaway, or discover your next destination.",
};
