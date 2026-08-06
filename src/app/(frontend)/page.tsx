import type { Metadata } from "next";
import dynamic from "next/dynamic";
import HomePageClient from "@/app/components/HomePageClient";
import { SITE_NAME, SITE_URL, absoluteUrl, buildPageMetadata } from "@/lib/seo";
import { getHomeContent } from "@/lib/cms/home";

// Loaded only in draft mode, so the published static page never requests
// this chunk.
const LivePreviewListener = dynamic(
  () => import("@/app/components/cms/LivePreviewListener")
);

export const metadata: Metadata = buildPageMetadata({
  title: "The Art of Seamless, Luxury Air Travel",
  description:
    "Midline Aviation delivers seamless luxury air travel with private charter, aircraft management, aircraft sales, MRO, and cargo transportation services.",
  path: "/",
  ogImage: "/assets/og/og-home.jpg",
  keywords: [
    "luxury air travel",
    "private aviation dubai",
    "aircraft charter",
    "aircraft management",
    "aircraft sales",
    "aircraft mro",
    "cargo transportation",
  ],
});

const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `${SITE_NAME} Home`,
  url: absoluteUrl("/"),
  description:
    "Midline Aviation combines luxury, privacy, and precision with private charter, fleet services, and global aviation support.",
  inLanguage: "en-US",
  isPartOf: {
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  },
  about: [
    {
      "@type": "Service",
      name: "Aircraft Charter",
      url: absoluteUrl("/services/aircraft-charter"),
    },
    {
      "@type": "Service",
      name: "Aircraft Management",
      url: absoluteUrl("/services/aircraft-management"),
    },
    {
      "@type": "Service",
      name: "Aircraft Sales",
      url: absoluteUrl("/services/aircraft-sales"),
    },
    {
      "@type": "Service",
      name: "Cargo Transportation",
      url: absoluteUrl("/services/cargo-transportation"),
    },
    {
      "@type": "Service",
      name: "Aircraft MRO",
      url: absoluteUrl("/services/mro"),
    },
  ],
};

export default async function HomePage() {
  // The accreditations marquee was removed from the homepage on client review
  // (Aug 2026) — the Accreditations collection still feeds /safety.
  const home = await getHomeContent();

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      {home.isDraft && <LivePreviewListener />}
      <HomePageClient home={home} />
    </>
  );
}
