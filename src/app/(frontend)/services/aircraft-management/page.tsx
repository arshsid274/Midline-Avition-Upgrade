import type { Metadata } from "next";
import { buildBreadcrumbSchema, buildPageMetadata, buildServiceSchema } from "@/lib/seo";
import AircraftManagementHeroSection from "@/app/components/ui/AircraftManagementHeroSection";
import AircraftManagementStandardsSection from "@/app/components/ui/AircraftManagementStandardsSection";
import AircraftManagementSafetyCardsSection from "@/app/components/ui/AircraftManagementSafetyCardsSection";
import AircraftManagementFleetSection from "@/app/components/ui/AircraftManagementFleetSection";
import { getServicePage } from "@/lib/cms/service";

export const revalidate = false;

export const metadata: Metadata = buildPageMetadata({
  title: "Aircraft Management Services",
  description:
    "Comprehensive aircraft management covering operations, crew, maintenance, and scheduling for safe and efficient performance.",
  path: "/services/aircraft-management",
  keywords: ["aircraft management services", "fleet operations support", "aviation compliance"],
  ogImage: "/assets/og/og-management.jpg",
});

const serviceSchema = buildServiceSchema({
  name: "Aircraft Management Services",
  serviceType: "Aircraft Management",
  description:
    "Comprehensive aircraft management covering operations, crew, maintenance, and scheduling for safe and efficient performance.",
  path: "/services/aircraft-management",
  images: ["/assets/og/og-management.jpg"],
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Aircraft Management", path: "/services/aircraft-management" },
]);

export default async function AircraftManagementPage() {
  const { hero, standards, features, showcase } = await getServicePage("management-page");

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
        <AircraftManagementHeroSection hero={hero} />
        <AircraftManagementStandardsSection content={standards} />
        <AircraftManagementSafetyCardsSection content={features} />
        <AircraftManagementFleetSection content={showcase} />
      </main>
    </>
  );
}
