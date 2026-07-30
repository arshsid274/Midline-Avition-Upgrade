import "server-only";

import { draftMode } from "next/headers";

import { tryGetPayload } from "@/lib/cms/payload";
import { FLEET_PAGE } from "@/lib/fleet-page-content";
import { uploadUrl } from "@/lib/cms/resolve";

const text = (v: unknown, f: string) => (typeof v === "string" && v.trim() ? v : f);
const img = (v: unknown, f: { src: string; alt: string }) =>
  v && typeof v === "object" && typeof (v as any).url === "string"
    ? { src: (v as any).url, alt: text((v as any).alt, f.alt) }
    : f;

export const getFleetPageContent = async () => {
  const { isEnabled: draft } = await draftMode();
  const payload = await tryGetPayload();
  const g = (payload
    ? await payload.findGlobal({ slug: "fleet-page", depth: 1, draft })
    : {}) as Record<string, any>;

  return {
    hero: {
      heading: text(g?.hero?.heading, FLEET_PAGE.hero.heading),
      body: text(g?.hero?.body, FLEET_PAGE.hero.body),
      videoUrl: uploadUrl(g?.hero?.videoUrl) ?? FLEET_PAGE.hero.videoUrl,
      poster: img(g?.hero?.poster, FLEET_PAGE.hero.poster),
    },
    interior: {
      heading: text(g?.interior?.heading, FLEET_PAGE.interior.heading),
      link: {
        label: text(g?.interior?.link?.label, FLEET_PAGE.interior.link.label),
        href: text(g?.interior?.link?.href, FLEET_PAGE.interior.link.href),
      },
      tiles: (g?.interior?.tiles ?? []).length
        ? g.interior.tiles.map((t: any, i: number) => ({
            ...img(t.image, FLEET_PAGE.interior.tiles[i] ?? { src: "", alt: "" }),
            caption: text(t.caption, ""),
          }))
        : FLEET_PAGE.interior.tiles.map((t) => ({ ...t, caption: (t as any).caption ?? "" })),
    },
  };
};
