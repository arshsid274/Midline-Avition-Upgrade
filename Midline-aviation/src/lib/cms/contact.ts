import "server-only";

import { draftMode } from "next/headers";
import { getPayload } from "payload";

import config from "@/payload.config";
import { CONTACT_CONTENT, type ContactContent } from "@/lib/contact-content";

export type ContactPageContent = ContactContent & { isDraft: boolean };

const text = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;

export const getContactContent = async (): Promise<ContactPageContent> => {
  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config });

  const global = (await payload.findGlobal({
    slug: "contact-page",
    depth: 1,
    draft,
  })) as Record<string, any>;

  const hero = global?.hero ?? {};
  const poster = hero.poster;

  const rows = (global?.details?.rows ?? []) as any[];

  return {
    isDraft: draft,
    eyebrow: text(hero.eyebrow, CONTACT_CONTENT.eyebrow),
    heading: text(hero.heading, CONTACT_CONTENT.heading),
    body: text(hero.body, CONTACT_CONTENT.body),
    videoUrl: text(hero.videoUrl, CONTACT_CONTENT.videoUrl),
    poster:
      poster && typeof poster === "object" && typeof poster.url === "string"
        ? { src: poster.url, alt: text(poster.alt, CONTACT_CONTENT.poster.alt) }
        : CONTACT_CONTENT.poster,
    details: rows.length
      ? rows.map((row) => ({
          kind: row.kind,
          value: text(row.value, ""),
          href: typeof row.href === "string" && row.href ? row.href : undefined,
        }))
      : CONTACT_CONTENT.details,
  };
};
