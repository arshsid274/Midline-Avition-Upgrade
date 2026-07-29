import "server-only";

import { draftMode } from "next/headers";
import { getPayload } from "payload";

import config from "@/payload.config";
import {
  HOME_CTA_BANNER,
  HOME_HERO,
  type CtaBannerContent,
  type HeroContent,
} from "@/lib/home-content";

export type HomeContent = {
  hero: HeroContent;
  ctaBanner: CtaBannerContent;
  /** True when rendering unpublished content, so the page can show a banner. */
  isDraft: boolean;
};

type MediaLike = { url?: unknown; alt?: unknown };

const imageFrom = (value: unknown, fallback: { src: string; alt: string }) => {
  if (!value || typeof value !== "object") return fallback;
  const { url, alt } = value as MediaLike;
  if (typeof url !== "string") return fallback;
  return { src: url, alt: typeof alt === "string" ? alt : fallback.alt };
};

const text = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;

const linkFrom = (value: unknown, fallback: { label: string; href: string }) => {
  const group = (value ?? {}) as { label?: unknown; href?: unknown };
  return {
    label: text(group.label, fallback.label),
    href: text(group.href, fallback.href),
  };
};

/**
 * Home page content, resolved for the current request.
 *
 * Reads draft content when the visitor carries Next's draft-mode cookie, which
 * is what makes live preview show unsaved edits while everyone else keeps
 * seeing the published page.
 *
 * Note that calling draftMode() does NOT force this page to render
 * dynamically: only enable()/disable() mark the route dynamic, and during a
 * prerender the getter returns a hard false. So `/` still builds as a static
 * route — verified by checking the build output, not assumed.
 *
 * Every field falls back to the committed content in src/lib/home-content.ts.
 * That is not defensive padding: Payload's drafts deliberately skip required
 * validation so an editor can save half-finished work, which means any field
 * can legitimately be null here.
 */
export const getHomeContent = async (): Promise<HomeContent> => {
  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config });

  // depth 1 resolves the poster upload so `url` is populated. Media has no
  // onward relationships, so one hop is enough.
  const global = (await payload.findGlobal({
    slug: "home-page",
    depth: 1,
    draft,
  })) as Record<string, any>;

  const hero = global?.hero ?? {};
  const heading = hero.heading ?? {};
  const banner = global?.ctaBanner ?? {};

  return {
    isDraft: draft,
    hero: {
      eyebrow: text(hero.eyebrow, HOME_HERO.eyebrow),
      heading: {
        line1: text(heading.line1, HOME_HERO.heading.line1),
        accent: text(heading.accent, HOME_HERO.heading.accent),
        rest: text(heading.rest, HOME_HERO.heading.rest),
      },
      body: text(hero.body, HOME_HERO.body),
      cta: linkFrom(hero.cta, HOME_HERO.cta),
      videoUrl: text(hero.videoUrl, HOME_HERO.videoUrl),
      poster: imageFrom(hero.poster, HOME_HERO.poster),
    },
    ctaBanner: {
      heading: text(banner.heading, HOME_CTA_BANNER.heading),
      body: text(banner.body, HOME_CTA_BANNER.body),
      primary: linkFrom(banner.primary, HOME_CTA_BANNER.primary),
      secondary: linkFrom(banner.secondary, HOME_CTA_BANNER.secondary),
    },
  };
};
