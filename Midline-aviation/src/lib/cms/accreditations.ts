import "server-only";

import { getPayload } from "payload";

import config from "@/payload.config";

/**
 * Serializable shape handed to Client Components. Deliberately not the raw
 * Payload document: `logo` is a relationship that resolves to a full Media doc,
 * and crossing the server/client boundary with it would ship far more than the
 * two fields the marquee actually renders.
 */
export type AccreditationLogo = {
  key: string;
  src: string;
  name: string;
  shortName: string;
};

const mediaUrl = (logo: unknown): string | null => {
  if (!logo || typeof logo !== "object") return null;
  const url = (logo as { url?: unknown }).url;
  return typeof url === "string" ? url : null;
};

/**
 * Enabled accreditations, in admin-defined order. Replaces the
 * `enabledAccreditations` export that used to live in src/lib/accreditations.ts.
 *
 * `depth: 1` resolves the logo upload so `url` is populated — without it the
 * field comes back as a bare ID and every logo silently disappears.
 */
export const getEnabledAccreditations = async (): Promise<AccreditationLogo[]> => {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "accreditations",
    where: { enabled: { equals: true } },
    sort: "order",
    depth: 1,
    limit: 100,
    pagination: false,
  });

  return docs.flatMap((doc) => {
    const src = mediaUrl(doc.logo);
    // A credential with a missing upload should not crash the page — skip it.
    if (!src) return [];
    return [{ key: doc.key, src, name: doc.name, shortName: doc.shortName }];
  });
};

/** Only memberships appear on /safety, matching the previous filter. */
export const getEnabledMemberships = async (): Promise<AccreditationLogo[]> => {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "accreditations",
    where: { enabled: { equals: true }, kind: { equals: "membership" } },
    sort: "order",
    depth: 1,
    limit: 100,
    pagination: false,
  });

  return docs.flatMap((doc) => {
    const src = mediaUrl(doc.logo);
    if (!src) return [];
    return [{ key: doc.key, src, name: doc.name, shortName: doc.shortName }];
  });
};
