import type { Metadata } from "next";
import { buildBreadcrumbSchema, buildPageMetadata, buildServiceSchema } from "@/lib/seo";
import CargoHeroSection from "@/app/components/ui/CargoHeroSection";
import CargoWhyChooseSection from "@/app/components/ui/CargoWhyChooseSection";
import CargoCapabilitiesSection from "@/app/components/ui/CargoCapabilitiesSection";
import { getServicePage } from "@/lib/cms/service";

export const revalidate = false;

export const metadata: Metadata = buildPageMetadata({
  title: "Air Cargo Transportation Services",
  description:
    "Reliable and secure cargo transportation services with rapid delivery, tracking, and global coverage.",
  path: "/services/cargo-transportation",
  keywords: ["air cargo transportation", "express air freight", "special cargo handling"],
  ogImage: "/assets/og/og-cargo.jpg",
});

const serviceSchema = buildServiceSchema({
  name: "Air Cargo Transportation Services",
  serviceType: "Air Cargo Transportation",
  description:
    "Reliable and secure cargo transportation services with rapid delivery, tracking, and global coverage.",
  path: "/services/cargo-transportation",
  images: ["/assets/og/og-cargo.jpg"],
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Cargo Transportation", path: "/services/cargo-transportation" },
]);

export default async function CargoTransportPage() {
  const { hero, features, showcase } = await getServicePage("cargo-page");

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
      <main>
        <CargoHeroSection hero={hero} />
        <CargoWhyChooseSection content={features} />
        <CargoCapabilitiesSection content={showcase} />
      </main>
    </>
  );
}
