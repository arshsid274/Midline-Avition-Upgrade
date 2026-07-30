import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAircraft, getAircraftBySlug, getAircraftSlugs } from "@/lib/cms/aircraft";
import {
  buildBreadcrumbSchema,
  buildPageMetadata,
  buildServiceSchema,
} from "@/lib/seo";
import JetHero from "@/app/components/ui/jet/JetHero";
import JetSpecsBand from "@/app/components/ui/jet/JetSpecsBand";
import JetEditorialGallery from "@/app/components/ui/jet/JetEditorialGallery";
import JetVerticalShowcase from "@/app/components/ui/jet/JetVerticalShowcase";
import JetCrossLinks from "@/app/components/ui/jet/JetCrossLinks";

// A newly created aircraft has no prerendered route until it is published —
// generateStaticParams cannot read draft mode — so allow on-demand rendering.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getAircraftSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fleet = await getAircraft();
  const jet = fleet.find((candidate) => candidate.slug === slug);
  if (!jet) return {};

  return buildPageMetadata({
    title: jet.seo.title,
    description: jet.seo.description,
    path: `/fleet/${jet.slug}`,
    keywords: jet.seo.keywords,
    ogImage: jet.ogImage,
    ogImageAlt: jet.hero.image.alt,
  });
}

export default async function JetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fleet = await getAircraft();
  const jet = fleet.find((candidate) => candidate.slug === slug);
  if (!jet) notFound();

  const serviceSchema = buildServiceSchema({
    name: `${jet.name} Charter — ${jet.tail}`,
    serviceType: "Private Jet Charter",
    description: jet.seo.description,
    path: `/fleet/${jet.slug}`,
    images: [jet.hero.image.src, ...jet.gallery.slice(0, 4).map((image) => image.src)],
    additionalProperty: jet.specs.map((spec) => ({
      name: spec.label,
      value: spec.displayValue ?? `${spec.value.toLocaleString("en-US")}${spec.unit ? ` ${spec.unit}` : ""}`,
    })),
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Fleet", path: "/fleet" },
    { name: jet.name, path: `/fleet/${jet.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="midline-page">
        <JetHero jet={jet} />
        <JetSpecsBand jet={jet} />
        <JetEditorialGallery jet={jet} />
        <JetVerticalShowcase jet={jet} />
        <JetCrossLinks jet={jet} fleet={fleet} />
      </main>
    </>
  );
}
