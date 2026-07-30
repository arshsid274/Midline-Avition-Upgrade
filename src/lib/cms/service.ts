import "server-only";

import { draftMode } from "next/headers";
import { getPayload } from "payload";

import config from "@/payload.config";
import { SERVICE_HEROES, type ServiceHero } from "@/lib/service-content";

const text = (v: unknown, f: string) => (typeof v === "string" && v.trim() ? v : f);

/**
 * Hero content for any of the five service pages.
 *
 * One helper rather than five: the pages share a shape, so they share a
 * mapper, and adding a sixth service page needs only an entry in
 * SERVICE_HEROES plus a global.
 */
export const getServiceHero = async (slug: keyof typeof SERVICE_HEROES): Promise<ServiceHero> => {
  const fallback = SERVICE_HEROES[slug];
  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config });
  const g = (await payload.findGlobal({ slug: slug as any, depth: 1, draft })) as Record<string, any>;
  const hero = g?.hero ?? {};
  const image = hero.image;

  const link = (v: any, f?: { label: string; href: string }) =>
    v && (v.label || v.href)
      ? { label: text(v.label, f?.label ?? ""), href: text(v.href, f?.href ?? "/contact") }
      : f;

  return {
    eyebrow: text(hero.eyebrow, fallback.eyebrow),
    heading: text(hero.heading, fallback.heading),
    headingAccent: text(hero.headingAccent, fallback.headingAccent ?? ""),
    body: text(hero.body, fallback.body),
    image:
      image && typeof image === "object" && typeof image.url === "string"
        ? { src: image.url, alt: text(image.alt, fallback.image.alt) }
        : fallback.image,
    primary: link(hero.primary, fallback.primary),
    secondary: link(hero.secondary, fallback.secondary),
    stats: (hero.stats ?? []).length
      ? hero.stats.map((s: any) => ({ value: text(s.value, ""), label: text(s.label, "") }))
      : fallback.stats,
  };
};
