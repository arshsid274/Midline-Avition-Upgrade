"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import "glightbox/dist/css/glightbox.min.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { gsap, ScrollTrigger, Flip, registerScrollTrigger } from "@/app/components/motion/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import AutoplayVideo from "@/app/components/motion/AutoplayVideo";
import { GALLERY_ITEMS, type GalleryItem } from "@/lib/gallery-content";

const CATEGORIES = ["All", "Embraer Legacy 650", "Gulfstream G450", "Gulfstream G200", "Services", "Videos"];

export default function GalleryClient({
  items = GALLERY_ITEMS,
}: {
  items?: GalleryItem[];
} = {}) {
  const galleryRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const prefersReducedMotion = useReducedMotion();

  // Reveals the header, filter bar, and the grid CONTAINER once. The grid's
  // children are intentionally not tagged so filter-driven remounts stay visible.
  useScrollReveal(galleryRef, { stagger: 0.1 });

  const filtered =
    activeCategory === "All"
      ? items
      : activeCategory === "Videos"
        ? // A film is a film whether we host it or it is linked from YouTube.
          items.filter((item) => item.poster || item.embed?.kind === "video")
        : items.filter((item) => item.category === activeCategory);

  // Capture positions BEFORE React re-renders the filtered grid…
  const handleCategory = (category: string) => {
    if (category === activeCategory) return;
    if (!prefersReducedMotion && gridRef.current) {
      registerScrollTrigger();
      flipStateRef.current = Flip.getState(gridRef.current.children);
    }
    setActiveCategory(category);
  };

  // …then FLIP the survivors into place and fade the newcomers in.
  useLayoutEffect(() => {
    const state = flipStateRef.current;
    if (!state || !gridRef.current) return;
    flipStateRef.current = null;

    Flip.from(state, {
      duration: 0.5,
      ease: "midline",
      stagger: 0.015,
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "midline" }),
      onComplete: () => {
        // Grid height changed — every trigger below must recompute.
        ScrollTrigger.refresh();
      },
    });
  }, [activeCategory]);

  useEffect(() => {
    let lightbox: { destroy: () => void } | null = null;
    let embedLightbox: { destroy: () => void } | null = null;

    async function initLightbox() {
      const GLightbox = (await import("glightbox")).default;
      // Cast: Plyr accepts `autoplay` at runtime; glightbox's Config type doesn't declare it.
      lightbox = GLightbox({
        selector: ".glightbox",
        touchNavigation: true,
        loop: true,
        openEffect: "fade",
        closeEffect: "fade",
        // Our gallery films are all portrait 9:16 — a narrower player plus a
        // matching ratio keeps them inside the viewport without letterboxing.
        videosWidth: "min(380px, 88vw)",
        plyr: {
          config: { autoplay: true, ratio: "9:16" },
        },
      } as Parameters<typeof GLightbox>[0]);

      /**
       * Linked films get their own instance rather than joining the one above.
       * That config forces a 9:16 ratio for our own portrait clips, and YouTube
       * and Vimeo are almost always 16:9 — sharing it would letterbox every
       * embed into a narrow column. Two instances also means two galleries, so
       * arrowing through linked films never lands mid-way into local ones.
       */
      embedLightbox = GLightbox({
        selector: ".glightbox-embed",
        touchNavigation: true,
        loop: true,
        openEffect: "fade",
        closeEffect: "fade",
        videosWidth: "min(900px, 92vw)",
        plyr: {
          config: { autoplay: true, ratio: "16:9" },
        },
      } as Parameters<typeof GLightbox>[0]);
    }

    initLightbox();
    return () => {
      lightbox?.destroy();
      embedLightbox?.destroy();
    };
  }, [filtered]);

  return (
    <main ref={galleryRef} className="min-h-screen bg-white pt-[84px]">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <h1 data-reveal-item className="text-3xl font-light text-ink sm:text-4xl">
          Gallery
        </h1>
        <p data-reveal-item className="mt-2 text-sm text-ink-muted sm:text-base">
          Explore our fleet — exterior, interior, in-flight photography &amp; film.
        </p>

        {/* Filter tabs */}
        <div data-reveal-item className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategory(cat)}
              className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-ibm-blue ${
                activeCategory === cat
                  ? "bg-ink text-white"
                  : "border border-hairline text-ink-muted hover:border-ink hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-6 h-px w-full bg-hairline" />
      </div>

      {/* Masonry grid — CSS columns so portrait and landscape cells pack tightly */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div ref={gridRef} data-reveal-item className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {filtered.map((item) => {
            const aspect = item.orientation === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]";
            const overlay = (
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="p-4">
                  <p className="text-xs text-white/70">
                    {item.category}
                    {/* Credits the source, so it is clear this is not our footage. */}
                    {item.embed ? ` · ${item.embed.host}` : ""}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-white">{item.caption}</p>
                </div>
              </div>
            );

            /**
             * A pasted link. The thumbnail comes from the source (or an uploaded
             * still), and the lightbox opens the original in place — GLightbox
             * plays YouTube and Vimeo natively via `data-source`.
             *
             * Plain <img>, not next/image: the host is whatever an editor
             * pasted, and next/image returns 400 for any host missing from
             * remotePatterns — a broken picture with nothing in the logs.
             */
            if (item.embed) {
              const isVideo = item.embed.kind === "video";
              return (
                <a
                  key={item.embed.watchUrl}
                  href={item.embed.watchUrl}
                  aria-label={
                    isVideo
                      ? `Play video on ${item.embed.host}: ${item.alt}`
                      : `View photo from ${item.embed.host}: ${item.alt}`
                  }
                  className={`${isVideo ? "glightbox-embed" : "glightbox"} group relative mb-5 block break-inside-avoid overflow-hidden bg-surface-1 ${aspect}`}
                  data-gallery={isVideo ? "midline-gallery-embeds" : "midline-gallery"}
                  data-description={item.caption}
                  data-type={isVideo ? "video" : "image"}
                  {...(isVideo ? { "data-source": item.embed.provider } : {})}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  {isVideo && (
                    <span
                      aria-hidden
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white transition-transform duration-300 group-hover:scale-110"
                    >
                      <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                    </span>
                  )}
                  {overlay}
                </a>
              );
            }

            if (item.poster) {
              return (
                <a
                  key={item.src}
                  href={item.src}
                  aria-label={`Play video: ${item.alt}`}
                  className={`glightbox group relative mb-5 block break-inside-avoid overflow-hidden bg-surface-1 ${aspect}`}
                  data-gallery="midline-gallery"
                  data-description={item.caption}
                  data-type="video"
                  data-source="local"
                >
                  <AutoplayVideo
                    src={item.src}
                    poster={item.poster}
                    aria-hidden
                    tabIndex={-1}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  />
                  <span
                    aria-hidden
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white transition-transform duration-300 group-hover:scale-110"
                  >
                    <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                  </span>
                  {overlay}
                </a>
              );
            }

            return (
              <a
                key={item.src}
                href={item.src}
                className={`glightbox group relative mb-5 block break-inside-avoid overflow-hidden bg-surface-1 ${aspect}`}
                data-gallery="midline-gallery"
                data-description={item.caption}
                data-type="image"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {overlay}
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
