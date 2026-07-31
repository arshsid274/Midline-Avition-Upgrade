import type { Metadata } from "next";
import { buildBreadcrumbSchema, buildPageMetadata, buildServiceSchema } from "@/lib/seo";
import AircraftCharterHeroComponent from "@/app/components/ui/AircraftCharterHeroComponent";
import OurPhilosophyComponent from "@/app/components/ui/OurPhilosophyComponent";
import CharterStepsComponent from "@/app/components/ui/CharterStepsComponent";
import WhyChooseUsComponent from "@/app/components/ui/WhyChooseUsComponent";
import BespokeTravelCategoriesComponent from "@/app/components/ui/BespokeTravelCategoriesComponent";
import ClientTestimonialsComponent from "@/app/components/ui/ClientTestimonialsComponent";
import { getServicePage } from "@/lib/cms/service";

export const revalidate = false;

export const metadata: Metadata = buildPageMetadata({
  title: "Private Jet Charter Services",
  description:
    "Experience personalized private jet charter designed for comfort, flexibility, and privacy with Midline Aviation.",
  path: "/services/aircraft-charter",
  keywords: ["private jet charter services", "on-demand charter flights", "business jet charter"],
  ogImage: "/assets/og/og-charter.jpg",
});

const serviceSchema = buildServiceSchema({
  name: "Private Jet Charter Services",
  serviceType: "Private Jet Charter",
  description:
    "Experience personalized private jet charter designed for comfort, flexibility, and privacy with Midline Aviation.",
  path: "/services/aircraft-charter",
  images: ["/assets/og/og-charter.jpg"],
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Aircraft Charter", path: "/services/aircraft-charter" },
]);

export default async function CharterPage() {
  const { hero, features, showcase } = await getServicePage("charter-page");

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
      <main className="midline-page bg-white">
        <AircraftCharterHeroComponent hero={hero} />
        <OurPhilosophyComponent />
        <CharterStepsComponent />
        <WhyChooseUsComponent content={features} />
        <BespokeTravelCategoriesComponent content={showcase} />

        <ClientTestimonialsComponent />
      </main>
    </>
  );
}
