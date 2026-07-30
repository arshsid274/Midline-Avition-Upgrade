import "server-only";

import { draftMode } from "next/headers";

import { tryGetPayload } from "@/lib/cms/payload";

const DEFAULTS = {
  privacy: { title: "Privacy Policy", updated: "July 2026" },
  terms: { title: "Terms & Conditions", updated: "July 2026" },
  cookies: { title: "Cookie Policy", updated: "July 2026" },
} as const;

const text = (v: unknown, f: string) => (typeof v === "string" && v.trim() ? v : f);

export const getLegalMeta = async (key: keyof typeof DEFAULTS) => {
  const { isEnabled: draft } = await draftMode();
  const payload = await tryGetPayload();
  const g = (payload
    ? await payload.findGlobal({ slug: "legal-pages", depth: 0, draft })
    : {}) as Record<string, any>;
  return {
    title: text(g?.[key]?.title, DEFAULTS[key].title),
    updated: text(g?.[key]?.updated, DEFAULTS[key].updated),
  };
};
