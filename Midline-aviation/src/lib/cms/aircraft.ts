import "server-only";

import { draftMode } from "next/headers";
import { getPayload } from "payload";

import config from "@/payload.config";
import { JETS, type Jet, type JetImage } from "@/lib/fleet";

/**
 * Aircraft, mapped back into the Jet shape the fleet components already
 * render, so JetHero, JetEditorialGallery, JetVerticalShowcase and
 * JetCrossLinks are untouched.
 *
 * width/height/orientation are filled with harmless placeholders: the type
 * still declares them, but no component reads them — every image renders with
 * `fill`. They were dropped from the CMS schema rather than carried as dead
 * fields an editor would have to maintain.
 */
const img = (value: unknown, span?: string): JetImage => {
  const media = (value ?? {}) as { url?: unknown; alt?: unknown };
  return {
    src: typeof media.url === "string" ? media.url : "",
    alt: typeof media.alt === "string" ? media.alt : "",
    width: 1600,
    height: 1069,
    orientation: "landscape",
    ...(span && span !== "standard" ? { span: span as JetImage["span"] } : {}),
  };
};

const toJet = (doc: any): Jet => ({
  slug: doc.slug,
  name: doc.name,
  tail: doc.tail,
  category: doc.category ?? "",
  tagline: doc.tagline ?? "",
  description: (doc.description ?? []).map((p: any) => p.text),
  specs: (doc.specs ?? []).map((s: any) => ({
    label: s.label,
    value: s.value ?? 0,
    unit: s.unit ?? "",
    note: s.note ?? "",
    ...(s.decimals != null ? { decimals: s.decimals } : {}),
    ...(s.displayValue ? { displayValue: s.displayValue } : {}),
  })),
  hero: {
    image: img(doc.heroImage),
    ...(doc.heroVideoUrl
      ? { video: { src: doc.heroVideoUrl, poster: img(doc.heroImage).src } }
      : {}),
  },
  gallery: (doc.gallery ?? []).map((g: any) => img(g.image, g.span)),
  ...(doc.verticalVideo?.url
    ? {
        verticalVideo: {
          src: doc.verticalVideo.url,
          poster: img(doc.verticalVideo.poster).src,
          heading: doc.verticalVideo.heading ?? "",
          caption: doc.verticalVideo.caption ?? "",
        },
      }
    : {}),
  ogImage: doc.ogImage ?? "/assets/og/og-fleet.jpg",
  seo: {
    title: doc.seoTitle ?? doc.name,
    description: doc.seoDescription ?? "",
    keywords: (doc.seoKeywords ?? []).map((k: any) => k.keyword),
  },
});

/** All aircraft, in admin order. Falls back to the committed data if empty. */
export const getAircraft = async (): Promise<Jet[]> => {
  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "aircraft",
    sort: "order",
    depth: 1,
    limit: 100,
    pagination: false,
    draft,
  });
  return docs.length ? docs.map(toJet) : JETS;
};

export const getAircraftBySlug = async (slug: string): Promise<Jet | undefined> =>
  (await getAircraft()).find((jet) => jet.slug === slug);

/**
 * Slugs for generateStaticParams.
 *
 * Deliberately does NOT read draft mode — calling draftMode() inside
 * generateStaticParams throws. A brand-new draft aircraft therefore has no
 * prerendered route until it is published, which is why the fleet page sets
 * dynamicParams so it still renders on demand.
 */
export const getAircraftSlugs = async (): Promise<string[]> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "aircraft",
    sort: "order",
    depth: 0,
    limit: 100,
    pagination: false,
  });
  return docs.length ? docs.map((d: any) => d.slug) : JETS.map((j) => j.slug);
};
