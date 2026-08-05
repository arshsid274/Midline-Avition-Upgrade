export type Accreditation = {
  id: string;
  src: string;
  /** Full organisation name — used for alt text and accessibility. */
  name: string;
  shortName: string;
  kind: "rating" | "membership" | "authority";
  /**
   * Launch toggle. Unverified credentials ship disabled and are enabled here
   * once ops provides the certificate — no component changes needed.
   */
  enabled: boolean;
};

export const ACCREDITATIONS: Accreditation[] = [
  {
    id: "is-bao",
    src: "/assets/images/accreditations/is-bao.webp",
    name: "IS-BAO — International Standard for Business Aircraft Operations",
    shortName: "IS-BAO",
    kind: "rating",
    enabled: true,
  },
  {
    id: "nbaa",
    src: "/assets/images/accreditations/nbaa.webp",
    name: "NBAA — National Business Aviation Association",
    shortName: "NBAA",
    kind: "membership",
    enabled: true,
  },
  {
    id: "aopa",
    src: "/assets/images/accreditations/aopa.webp",
    name: "AOPA — Aircraft Owners and Pilots Association",
    shortName: "AOPA",
    kind: "membership",
    enabled: true,
  },
  {
    // Published on request, 2026-08-05. The label is still unconfirmed: the
    // body may be BACA or MEBAA rather than "The Air Charter Association".
    // Correct `name` and `shortName` here once ops says which, and re-run
    // `npm run seed:accreditations` — the strip reads both fields.
    id: "air-charter-association",
    src: "/assets/images/accreditations/air-charter-association.webp",
    name: "The Air Charter Association",
    shortName: "The Air Charter Association",
    kind: "membership",
    enabled: true,
  },
  {
    // Published on request, 2026-08-05. The certificate level (Wingman vs
    // Registered) was never verified. The mark carries no tier on its own, so
    // nothing here states one — do not add a level to `name` without the
    // certificate in hand.
    id: "wyvern",
    src: "/assets/images/accreditations/wyvern.webp",
    name: "WYVERN",
    shortName: "WYVERN",
    kind: "rating",
    enabled: true,
  },
  {
    // Published on request, 2026-08-05, against the original ops brief: this
    // authority is not in it and the fleet flies on San Marino T7- registrations.
    // Kept enabled because it was asked for explicitly; revisit if the registry
    // is ever queried.
    id: "caa-cayman",
    src: "/assets/images/accreditations/caa-cayman.webp",
    name: "Civil Aviation Authority of the Cayman Islands",
    shortName: "CAA Cayman Islands",
    kind: "authority",
    enabled: true,
  },
];

export const enabledAccreditations = ACCREDITATIONS.filter((a) => a.enabled);

export const enabledMemberships = enabledAccreditations.filter((a) => a.kind === "membership");
