import "server-only";


import { tryGetPayload } from "@/lib/cms/payload";
import { GALLERY_ITEMS, type GalleryItem } from "@/lib/gallery-content";
import { uploadUrl } from "@/lib/cms/resolve";
import { parseEmbed } from "@/lib/embeds";

/**
 * Gallery tiles in admin order.
 *
 * Returns the same GalleryItem shape the client component already renders —
 * including the convention that a `poster` marks a video — so the grid,
 * filtering and lightbox code is untouched.
 */
export const getGalleryItems = async (): Promise<GalleryItem[]> => {
  const payload = await tryGetPayload();
  const docs = payload ? (await payload.find({
    collection: "gallery-items",
    sort: "order",
    depth: 1,
    limit: 500,
    pagination: false,
  })).docs : [];

  if (!docs.length) return GALLERY_ITEMS;

  return docs.flatMap((doc: any) => {
    const common = {
      alt: doc.alt ?? "",
      category: doc.category ?? "",
      caption: doc.caption ?? "",
      orientation: doc.orientation ?? "landscape",
    };

    /**
     * A pasted link. The tile needs a still to show in the grid: YouTube
     * publishes one at a predictable address, Vimeo does not, so an uploaded
     * poster wins where present and is the only option for Vimeo. A row with
     * neither is dropped rather than rendered as a hole in the grid — the same
     * treatment a photo with no upload already gets below.
     */
    if (doc.kind === "link") {
      const parsed = parseEmbed(doc.embedUrl);
      if (!parsed) return [];

      const thumbnail = doc.poster?.url ?? parsed.thumbnailUrl;
      if (typeof thumbnail !== "string" || !thumbnail) return [];

      return [
        {
          ...common,
          src: thumbnail,
          embed: {
            provider: parsed.provider,
            kind: parsed.kind,
            watchUrl: parsed.watchUrl,
            host: parsed.host,
          },
        } as GalleryItem,
      ];
    }

    const isVideo = doc.kind === "video";
    const src = isVideo ? uploadUrl(doc.videoUrl) : doc.image?.url;
    if (typeof src !== "string" || !src) return [];
    return [
      {
        ...common,
        src,
        ...(isVideo && doc.poster?.url ? { poster: doc.poster.url } : {}),
      } as GalleryItem,
    ];
  });
};
