/**
 * Safety page content, lifted from the page component verbatim.
 * Seed source for the Safety global.
 */

export type Fact = { label: string; value: string };

export type SafetyContent = {
  hero: { eyebrow: string; heading: string; body: string };
  operator: { eyebrow: string; heading: string; body: string; facts: Fact[] };
  ratings: { eyebrow: string; heading: string; cardTitle: string; cardBody: string };
  memberships: { eyebrow: string; heading: string };
  insurance: { eyebrow: string; body: string };
  maintenance: { eyebrow: string; heading: string; body: string; facts: Fact[] };
  questions: { heading: string; body: string };
};

export const SAFETY_CONTENT: SafetyContent = {
  hero: {
    eyebrow: "Safety & Certifications",
    heading: "Safety is the standard, not the amenity.",
    body: "Every Midline Aviation charter is flown under a certificated operator, audited operating standards, and comprehensive insurance — here is exactly how our flights are run.",
  },
  operator: {
    eyebrow: "Operator",
    heading: "Flown under a certificated operator.",
    body: "Midline Aviation arranges and manages private charter flights operated under the Air Operator Certificate (AOC) of Titan Aviation, registered with the Civil Aviation Authority of San Marino. The AOC authorises private charter operations.",
    facts: [
      { label: "Registered operator on AOC", value: "Titan Aviation" },
      { label: "Issuing authority", value: "Civil Aviation Authority of San Marino" },
      { label: "Authorisation", value: "Private charter operations" },
    ],
  },
  ratings: {
    eyebrow: "Safety Ratings & Audits",
    heading: "Audited operating standards.",
    cardTitle: "IS-BAO",
    cardBody:
      "Our operations are conducted to the International Standard for Business Aircraft Operations (IS-BAO) — the global benchmark for business aviation safety management.",
  },
  memberships: {
    eyebrow: "Memberships & Affiliations",
    heading: "Part of the business aviation community.",
  },
  insurance: {
    eyebrow: "Insurance",
    body: "All flights are covered by comprehensive liability insurance arranged through Gallagher.",
  },
  maintenance: {
    eyebrow: "Maintenance & Crew",
    heading: "Maintained aircraft, current crews.",
    body: "Aircraft maintenance is carried out by Titan Aviation. All aircraft hold current Certificates of Airworthiness, and flight crew complete recurrent training programmes.",
    facts: [
      { label: "Maintenance", value: "Carried out by Titan Aviation" },
      { label: "Airworthiness", value: "Current Certificates of Airworthiness across the fleet" },
      { label: "Flight crew", value: "Recurrent training programmes" },
    ],
  },
  questions: {
    heading: "Questions about how we operate?",
    body: "— we are happy to walk you through our operating arrangements before you fly.",
  },
};
