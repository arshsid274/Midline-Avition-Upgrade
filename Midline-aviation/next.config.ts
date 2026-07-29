import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// Cloudflare R2 custom domain serving CMS-managed images. Left unset locally,
// where uploads fall back to Payload's own file route.
const mediaHost = process.env.NEXT_PUBLIC_MEDIA_URL;

const nextConfig: NextConfig = {
  // Gzip all server responses
  compress: true,

  // Tree-shake heavy barrel-export libraries so only the icons/components
  // actually used are bundled — shrinks client JS and cuts parse/eval time.
  experimental: {
    optimizePackageImports: [
      "react-icons",
      "lucide-react",
      "motion",
      "@gsap/react",
      "embla-carousel-react",
      "embla-carousel-autoplay",
    ],
  },

  // ── Image optimisation ────────────────────────────────────────────────────
  images: {
    // Serve AVIF first (best compression), WebP as fallback
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimised images for 30 days on the server (default is 60 s)
    minimumCacheTTL: 2592000,
    // Images served from R2 must be allow-listed or next/image returns 400.
    // This is the single most likely failure when migrating a surface, and it
    // is invisible on pages that use a raw <img> instead of next/image.
    remotePatterns: mediaHost ? [new URL(`${mediaHost}/**`)] : [],
  },

  // ── Long-lived cache headers for static public/ assets ───────────────────
  async headers() {
    return [
      {
        // Airports dataset — large but static; cache for 7 days
        source: "/data/airports.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Private-charter airports dataset — large but static; cache for 7 days
        source: "/privateairports.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // All other images in public/assets/
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Fonts & videos
        source: "/:path*.(woff|woff2|ttf|otf|mp4|webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Security headers on every response (boosts Lighthouse Best Practices)
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options",        value: "SAMEORIGIN" },
          { key: "X-XSS-Protection",       value: "1; mode=block" },
          { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  turbopack: {
    root: process.cwd(),
  },
};

// withPayload injects the admin panel's bundler config. The nextConfig object
// above is passed through untouched — the existing headers(), image tuning and
// optimizePackageImports all still apply to the marketing site.
export default withPayload(nextConfig, { devBundleServerPackages: false });
