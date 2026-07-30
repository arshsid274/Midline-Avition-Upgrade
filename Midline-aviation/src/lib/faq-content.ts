/**
 * FAQ page content, lifted from the page component verbatim.
 * Seed source for the FAQ global.
 */

export type QA = { q: string; a: string };
export type FaqGroup = { heading: string; items: QA[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    heading: "Booking & Payment",
    items: [
      {
        q: "What is the minimum booking lead time?",
        a: "Flights can be arranged at extremely short notice — in some cases from as little as 30 minutes, subject to aircraft availability, routing, and permits.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept bank transfer, credit card, cash, and cryptocurrency.",
      },
      {
        q: "Which currencies can I pay in?",
        a: "AED, USD, and EUR.",
      },
      {
        q: "Is a deposit required to confirm a booking?",
        a: "Full payment is required upon confirmation of the booking.",
      },
      {
        q: "Are quoted prices all-inclusive?",
        a: "Yes — our quotes are fully all-inclusive, with no additional fees or taxes on top.",
      },
    ],
  },
  {
    heading: "Cancellation & Refunds",
    items: [
      {
        q: "What is your cancellation policy?",
        a: "Cancellation fees apply against the total charter price (invoice plus any non-refundable costs): 10% from signing of the contract; 50% within 7 days (168 hours) but more than 48 hours before scheduled departure; 75% within 48 hours but more than 24 hours before departure; and 100% within 24 hours of departure or in case of a no-show.",
      },
      {
        q: "How are refunds handled and how long do they take?",
        a: "Refunds are issued via the original payment method and are typically processed within 2–3 working days.",
      },
    ],
  },
  {
    heading: "Onboard & Policies",
    items: [
      {
        q: "Are pets allowed on board?",
        a: "Yes — pets are welcome in the cabin. A fee of USD 1,500 applies per pet. Please advise us at booking.",
      },
      {
        q: "What is your smoking policy?",
        a: "Smoking is permitted on board, subject to a USD 2,000 cleaning fee.",
      },
      {
        q: "What catering options do you offer?",
        a: "We offer both standard and VIP catering options, tailored to your preferences.",
      },
    ],
  },
  {
    heading: "Travel Logistics",
    items: [
      {
        q: "Do you arrange ground transport and airport transfers?",
        a: "Yes — ground transportation and airport transfers can be arranged on request.",
      },
      {
        q: "Do you provide passport and visa support?",
        a: "Passports and visas are the passenger's responsibility. We recommend confirming entry requirements for your destination before travel.",
      },
      {
        q: "Which airports and FBOs do you use in key hubs?",
        a: "In Dubai we operate from DWC (Falcon Aviation and ExecuJet FBOs) and DXB (Jet Aviation FBO).",
      },
    ],
  },
];

export const FAQ_PAGE = {
  hero: {
    eyebrow: "FAQ",
    heading: "Frequently asked questions.",
    body: "Booking, payment, policies, and logistics — the answers our clients ask for most. Anything else, we are one message away.",
  },
  closing: {
    heading: "Still have a question?",
    bodyBefore: "Our team answers around the clock at",
    bodyAfter: "— or use the booking form and we will come back with a tailored quote.",
  },
};
