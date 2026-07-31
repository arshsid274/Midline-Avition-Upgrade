import "server-only";

import { draftMode } from "next/headers";

import { tryGetPayload } from "@/lib/cms/payload";
import {
  SERVICE_CHIPS,
  SERVICE_CLOSINGS,
  SERVICE_FEATURES,
  SERVICE_HEROES,
  SERVICE_INTROS,
  SERVICE_SHOWCASES,
  SERVICE_STANDARDS,
  type FeatureCard,
  type ServiceChips,
  type ServiceClosing,
  type ServiceHero,
  type ServiceIntro,
  type ServiceSection,
  type ServiceSlug,
  type ServiceStandards,
  type ShowcaseCard,
} from "@/lib/service-content";
import type { IconName } from "@/lib/icon-names";

const text = (v: unknown, f: string) => (typeof v === "string" && v.trim() ? v : f);

const link = (v: any, f?: { label: string; href: string }) =>
  v && (v.label || v.href)
    ? { label: text(v.label, f?.label ?? ""), href: text(v.href, f?.href ?? "/contact") }
    : f;

export type ServicePageContent = {
  hero: ServiceHero;
  features: ServiceSection<FeatureCard>;
  showcase: ServiceSection<ShowcaseCard>;
  /** Only management renders this; undefined elsewhere. */
  standards?: ServiceStandards;
  /** Only sales renders these; undefined elsewhere. */
  intro?: ServiceIntro;
  chips?: ServiceChips;
  closing?: ServiceClosing;
};

/**
 * Everything one service page needs, from a single read of its global.
 *
 * One fetch rather than one per section: findGlobal is a network round trip to
 * a hosted database, and a page asking separately for its hero, its feature
 * cards and its picture cards would pay for that three times over.
 *
 * Every field falls back individually to the constants in service-content.ts.
 * That is not defensiveness for its own sake — drafts have
 * `validate: false`, so any field can legitimately be absent, and a section
 * whose cards array is empty must render the built-in content rather than an
 * empty band on a live marketing page.
 */
export const getServicePage = async (
  slug: ServiceSlug
): Promise<ServicePageContent> => {
  const heroFallback = SERVICE_HEROES[slug];
  const featuresFallback = SERVICE_FEATURES[slug];
  const showcaseFallback = SERVICE_SHOWCASES[slug];

  const { isEnabled: draft } = await draftMode();
  const payload = await tryGetPayload();
  const g = (payload
    ? await payload.findGlobal({ slug: slug as any, depth: 1, draft })
    : {}) as Record<string, any>;

  const hero = g?.hero ?? {};
  const heroImage = hero.image;

  const section = <TCard>(
    raw: any,
    fallback: ServiceSection<TCard> | undefined,
    mapCard: (card: any, index: number) => TCard | null
  ): ServiceSection<TCard> => {
    const empty: ServiceSection<TCard> = { heading: "", cards: [] };
    const base = fallback ?? empty;
    const cards = Array.isArray(raw?.cards)
      ? (raw.cards.map(mapCard).filter(Boolean) as TCard[])
      : [];
    return {
      eyebrow: text(raw?.eyebrow, base.eyebrow ?? ""),
      heading: text(raw?.heading, base.heading),
      intro: text(raw?.intro, base.intro ?? ""),
      // An empty array means "nothing has been entered", not "show nothing".
      cards: cards.length ? cards : base.cards,
      stats: (raw?.stats ?? []).length
        ? raw.stats.map((v: any) => ({ value: text(v.value, ""), label: text(v.label, "") }))
        : base.stats,
    };
  };

  const imageOr = (raw: any, fallback: { src: string; alt: string }) =>
    raw && typeof raw === "object" && typeof raw.url === "string"
      ? { src: raw.url, alt: text(raw.alt, fallback.alt) }
      : fallback;

  const featureCard = (card: any): FeatureCard | null =>
    card?.title
      ? {
          title: card.title,
          description: text(card.description, ""),
          icon: (card.icon ?? undefined) as IconName | undefined,
          points: Array.isArray(card.points)
            ? card.points.map((p: any) => text(p?.text, "")).filter(Boolean)
            : undefined,
          ...(typeof card.featured === "boolean" ? { featured: card.featured } : {}),
        }
      : null;

  return {
    hero: {
      eyebrow: text(hero.eyebrow, heroFallback.eyebrow),
      heading: text(hero.heading, heroFallback.heading),
      headingAccent: text(hero.headingAccent, heroFallback.headingAccent ?? ""),
      headingRest: text(hero.headingRest, heroFallback.headingRest ?? ""),
      body: text(hero.body, heroFallback.body),
      bodySecondary: text(hero.bodySecondary, heroFallback.bodySecondary ?? ""),
      footnote: text(hero.footnote, heroFallback.footnote ?? ""),
      image:
        heroImage && typeof heroImage === "object" && typeof heroImage.url === "string"
          ? { src: heroImage.url, alt: text(heroImage.alt, heroFallback.image.alt) }
          : heroFallback.image,
      primary: link(hero.primary, heroFallback.primary),
      secondary: link(hero.secondary, heroFallback.secondary),
      stats: (hero.stats ?? []).length
        ? hero.stats.map((s: any) => ({ value: text(s.value, ""), label: text(s.label, "") }))
        : heroFallback.stats,
    },

    features: section<FeatureCard>(g?.features, featuresFallback, featureCard),

    showcase: section<ShowcaseCard>(g?.showcase, showcaseFallback, (card) => {
      // A card with no picture is dropped: next/image throws on an empty src,
      // and an incomplete draft card must not take the page down.
      const img = card?.image;
      const src = img && typeof img === "object" ? img.url : undefined;
      if (!card?.title || typeof src !== "string") return null;
      return {
        title: card.title,
        description: text(card.description, ""),
        image: { src, alt: text(img.alt, card.title) },
        link: link(card.link),
        badge: text(card.badge, ""),
        icon: (card.icon ?? undefined) as IconName | undefined,
      };
    }),

    standards: (() => {
      const base = SERVICE_STANDARDS[slug];
      if (!base) return undefined;
      const d = g?.standards ?? {};
      const cards = Array.isArray(d.cards)
        ? (d.cards.map(featureCard).filter(Boolean) as FeatureCard[])
        : [];
      return {
        eyebrow: text(d.eyebrow, base.eyebrow),
        heading: text(d.heading, base.heading),
        headingAccent: text(d.headingAccent, base.headingAccent ?? ""),
        intro: text(d.intro, base.intro),
        cards: cards.length ? cards : base.cards,
        image: imageOr(d.image, base.image),
        figureValue: text(d.figureValue, base.figureValue),
        figureLabel: text(d.figureLabel, base.figureLabel),
      };
    })(),

    intro: (() => {
      const base = SERVICE_INTROS[slug];
      if (!base) return undefined;
      const d = g?.intro ?? {};
      const paragraphs = Array.isArray(d.paragraphs)
        ? d.paragraphs.map((p: any) => text(p?.text, "")).filter(Boolean)
        : [];
      return {
        eyebrow: text(d.eyebrow, base.eyebrow),
        heading: text(d.heading, base.heading),
        paragraphs: paragraphs.length ? paragraphs : base.paragraphs,
      };
    })(),

    chips: (() => {
      const base = SERVICE_CHIPS[slug];
      if (!base) return undefined;
      const d = g?.services ?? {};
      const chips = Array.isArray(d.chips)
        ? d.chips
            .filter((c: any) => c?.label)
            .map((c: any) => ({ label: c.label as string, icon: (c.icon ?? undefined) as IconName | undefined }))
        : [];
      return {
        eyebrow: text(d.eyebrow, base.eyebrow),
        heading: text(d.heading, base.heading),
        intro: text(d.intro, base.intro),
        chips: chips.length ? chips : base.chips,
      };
    })(),

    closing: (() => {
      const base = SERVICE_CLOSINGS[slug];
      if (!base) return undefined;
      const d = g?.closing ?? {};
      return {
        eyebrow: text(d.eyebrow, base.eyebrow),
        heading: text(d.heading, base.heading),
        body: text(d.body, base.body),
        cta: link(d.cta, base.cta),
      };
    })(),
  };
};

/**
 * Hero only, for the service pages whose body sections are not yet CMS-driven.
 * Delegates so there is one mapper, not two that can disagree.
 */
export const getServiceHero = async (
  slug: ServiceSlug
): Promise<ServiceHero> => (await getServicePage(slug)).hero;
