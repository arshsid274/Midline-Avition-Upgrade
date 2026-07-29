import "server-only";

import { draftMode } from "next/headers";
import { getPayload } from "payload";

import config from "@/payload.config";
import { SAFETY_CONTENT, type Fact, type SafetyContent } from "@/lib/safety-content";

const text = (v: unknown, f: string) => (typeof v === "string" && v.trim() ? v : f);
const facts = (v: unknown, f: Fact[]): Fact[] =>
  Array.isArray(v) && v.length
    ? v.map((r: any) => ({ label: text(r.label, ""), value: text(r.value, "") }))
    : f;

export const getSafetyContent = async (): Promise<SafetyContent> => {
  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config });
  const g = (await payload.findGlobal({ slug: "safety-page", depth: 1, draft })) as Record<string, any>;
  const d = SAFETY_CONTENT;

  return {
    hero: {
      eyebrow: text(g?.hero?.eyebrow, d.hero.eyebrow),
      heading: text(g?.hero?.heading, d.hero.heading),
      body: text(g?.hero?.body, d.hero.body),
    },
    operator: {
      eyebrow: text(g?.operator?.eyebrow, d.operator.eyebrow),
      heading: text(g?.operator?.heading, d.operator.heading),
      body: text(g?.operator?.body, d.operator.body),
      facts: facts(g?.operator?.facts, d.operator.facts),
    },
    ratings: {
      eyebrow: text(g?.ratings?.eyebrow, d.ratings.eyebrow),
      heading: text(g?.ratings?.heading, d.ratings.heading),
      cardTitle: text(g?.ratings?.cardTitle, d.ratings.cardTitle),
      cardBody: text(g?.ratings?.cardBody, d.ratings.cardBody),
    },
    memberships: {
      eyebrow: text(g?.memberships?.eyebrow, d.memberships.eyebrow),
      heading: text(g?.memberships?.heading, d.memberships.heading),
    },
    insurance: {
      eyebrow: text(g?.insurance?.eyebrow, d.insurance.eyebrow),
      body: text(g?.insurance?.body, d.insurance.body),
    },
    maintenance: {
      eyebrow: text(g?.maintenance?.eyebrow, d.maintenance.eyebrow),
      heading: text(g?.maintenance?.heading, d.maintenance.heading),
      body: text(g?.maintenance?.body, d.maintenance.body),
      facts: facts(g?.maintenance?.facts, d.maintenance.facts),
    },
    questions: {
      heading: text(g?.questions?.heading, d.questions.heading),
      body: text(g?.questions?.body, d.questions.body),
    },
  };
};
