import "server-only";

import { draftMode } from "next/headers";

import { tryGetPayload } from "@/lib/cms/payload";
import { FAQ_GROUPS, FAQ_PAGE, type FaqGroup } from "@/lib/faq-content";

const text = (v: unknown, f: string) => (typeof v === "string" && v.trim() ? v : f);

export type FaqContent = {
  hero: { eyebrow: string; heading: string; body: string };
  groups: FaqGroup[];
  closing: { heading: string; bodyBefore: string; bodyAfter: string };
};

export const getFaqContent = async (): Promise<FaqContent> => {
  const { isEnabled: draft } = await draftMode();
  const payload = await tryGetPayload();
  const g = (payload
    ? await payload.findGlobal({ slug: "faq-page", depth: 0, draft })
    : {}) as Record<string, any>;

  const groups: FaqGroup[] = (g?.groups?.items ?? []).length
    ? g.groups.items.map((grp: any) => ({
        heading: text(grp.heading, ""),
        items: (grp.questions ?? []).map((qa: any) => ({
          q: text(qa.q, ""),
          a: text(qa.a, ""),
        })),
      }))
    : FAQ_GROUPS;

  return {
    hero: {
      eyebrow: text(g?.hero?.eyebrow, FAQ_PAGE.hero.eyebrow),
      heading: text(g?.hero?.heading, FAQ_PAGE.hero.heading),
      body: text(g?.hero?.body, FAQ_PAGE.hero.body),
    },
    groups,
    closing: {
      heading: text(g?.closing?.heading, FAQ_PAGE.closing.heading),
      bodyBefore: text(g?.closing?.bodyBefore, FAQ_PAGE.closing.bodyBefore),
      bodyAfter: text(g?.closing?.bodyAfter, FAQ_PAGE.closing.bodyAfter),
    },
  };
};
