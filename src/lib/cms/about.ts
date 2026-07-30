import "server-only";

import { draftMode } from "next/headers";

import { tryGetPayload } from "@/lib/cms/payload";
import {
  ABOUT_LEADERSHIP,
  ABOUT_PAGE,
  ABOUT_STORY,
  ABOUT_SUSTAINABILITY,
  featureSlides,
  leadershipMembers,
  type FeatureSlide,
  type LeadershipMember,
} from "@/lib/about-content";

const text = (v: unknown, f: string) => (typeof v === "string" && v.trim() ? v : f);
const img = (v: unknown, f: { src: string; alt: string }) =>
  v && typeof v === "object" && typeof (v as any).url === "string"
    ? { src: (v as any).url, alt: text((v as any).alt, f.alt) }
    : f;

export type AboutContent = {
  whatWeDo: { heading: string; slides: FeatureSlide[] };
  story: { heading: string; paragraphs: string[]; image: { src: string; alt: string } };
  sustainability: typeof ABOUT_SUSTAINABILITY;
  leadership: { eyebrow: string; heading: string; intro: string; members: LeadershipMember[] };
};

export const getAboutContent = async (): Promise<AboutContent> => {
  const { isEnabled: draft } = await draftMode();
  const payload = await tryGetPayload();
  const g = (payload
    ? await payload.findGlobal({ slug: "about-page", depth: 1, draft })
    : {}) as Record<string, any>;

  const slides: FeatureSlide[] = (g?.whatWeDo?.slides ?? []).length
    ? g.whatWeDo.slides.map((s: any, i: number) => ({
        key: (featureSlides[i]?.key ?? "charters") as FeatureSlide["key"],
        label: text(s.label, ""),
        eyebrow: text(s.label, ""),
        title: text(s.title, ""),
        description: text(s.description, ""),
        ctaHref: text(s.link?.href, "/contact"),
        imageSrc: img(s.image, { src: "", alt: "" }).src,
        imageAlt: img(s.image, { src: "", alt: "" }).alt,
        imagePosition: text(s.imagePosition, "center"),
      }))
    : featureSlides;

  const members: LeadershipMember[] = (g?.leadership?.members ?? []).length
    ? g.leadership.members.map((m: any) => ({
        name: text(m.name, ""),
        title: text(m.title, ""),
        bio: text(m.bio, ""),
        imageSrc: img(m.photo, { src: "", alt: "" }).src,
        objectPosition: text(m.objectPosition, "center"),
      }))
    : leadershipMembers;

  const s = g?.sustainability ?? {};

  return {
    whatWeDo: { heading: text(g?.whatWeDo?.heading, ABOUT_PAGE.whatWeDo.heading), slides },
    story: {
      heading: text(g?.story?.heading, ABOUT_STORY.heading),
      paragraphs: (g?.story?.paragraphs ?? []).length
        ? g.story.paragraphs.map((p: any) => text(p.text, ""))
        : ABOUT_STORY.paragraphs,
      image: img(g?.story?.image, ABOUT_STORY.image),
    },
    sustainability: {
      eyebrow: text(s.eyebrow, ABOUT_SUSTAINABILITY.eyebrow),
      heading: text(s.heading, ABOUT_SUSTAINABILITY.heading),
      intro: text(s.intro, ABOUT_SUSTAINABILITY.intro),
      image: img(s.image, ABOUT_SUSTAINABILITY.image),
      cardTitle: text(s.cardTitle, ABOUT_SUSTAINABILITY.cardTitle),
      cardBody: text(s.cardBody, ABOUT_SUSTAINABILITY.cardBody),
      points: (s.points ?? []).length
        ? s.points.map((p: any) => text(p.text, ""))
        : ABOUT_SUSTAINABILITY.points,
      link: {
        label: text(s.link?.label, ABOUT_SUSTAINABILITY.link.label),
        href: text(s.link?.href, ABOUT_SUSTAINABILITY.link.href),
      },
    },
    leadership: {
      eyebrow: text(g?.leadership?.eyebrow, ABOUT_LEADERSHIP.eyebrow),
      heading: text(g?.leadership?.heading, ABOUT_LEADERSHIP.heading),
      intro: text(g?.leadership?.intro, ABOUT_LEADERSHIP.intro),
      members,
    },
  };
};
