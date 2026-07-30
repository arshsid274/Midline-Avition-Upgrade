import "server-only";

import { getPayload } from "payload";

import config from "@/payload.config";
import { GALLERY_ITEMS, type GalleryItem } from "@/lib/gallery-content";
import { uploadUrl } from "@/lib/cms/resolve";

/**
 * Gallery tiles in admin order.
 *
 * Returns the same GalleryItem shape the client component already renders —
 * including the convention that a `poster` marks a video — so the grid,
 * filtering and lightbox code is untouched.
 */
export const getGalleryItems = async (): Promise<GalleryItem[]> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "gallery-items",
    sort: "order",
    depth: 1,
    limit: 500,
    pagination: false,
  });

  if (!docs.length) return GALLERY_ITEMS;

  return docs.flatMap((doc: any) => {
    const isVideo = doc.kind === "video";
    const src = isVideo ? uploadUrl(doc.videoUrl) : doc.image?.url;
    if (typeof src !== "string" || !src) return [];
    return [
      {
        src,
        alt: doc.alt ?? "",
        category: doc.category ?? "",
        caption: doc.caption ?? "",
        orientation: doc.orientation ?? "landscape",
        ...(isVideo && doc.poster?.url ? { poster: doc.poster.url } : {}),
      } as GalleryItem,
    ];
  });
};
