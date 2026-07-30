import type { Metadata } from "next";
import { absoluteUrl, buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import ContactInquiryForm from "@/app/components/ui/ContactInquiryForm";
import { getContactContent } from "@/lib/cms/contact";
import ContactDetailRows from "@/app/components/ui/ContactDetailRows";
import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";

export const revalidate = false;

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Midline Aviation",
  description:
    "Contact Midline Aviation customer service in Dubai for charter, management, sales, MRO, and cargo transportation support.",
  path: "/contact",
  keywords: ["contact midline aviation", "dubai aviation office", "private charter support"],
  ogImage: "/assets/og/og-contact.jpg",
});

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Midline Aviation",
  url: absoluteUrl("/contact"),
};

const breadcrumbSchema = buildBreadcrumbSchema([{ name: "Contact", path: "/contact" }]);

export default async function ContactPage() {
  const content = await getContactContent();

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="relative isolate -mt-[72px] min-h-[100svh] overflow-hidden md:-mt-[84px]">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={content.poster.src}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={content.videoUrl} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/22" />
      <div className="absolute inset-0 bg-gradient-to-l from-black/72 via-black/40 to-black/18" />

      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-7xl px-4 pb-8 pt-[96px] sm:px-6 md:pb-10 md:pt-[114px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:px-8">
        <Reveal
          as="section"
          on="load"
          variant="stagger"
          stagger={0.12}
          delay={0.1}
          className="flex flex-col justify-center text-white"
        >
          <p data-reveal-item className="text-sm text-inverse-ink-muted">{content.eyebrow}</p>
          <SplitHeading key={content.heading} as="h1" mode="lcp" on="load" delay={0.25} className="font-display mt-4 text-4xl font-light leading-tight sm:text-5xl md:text-6xl">
            {content.heading}
          </SplitHeading>
          <p data-reveal-item className="mt-5 max-w-xl text-sm leading-relaxed text-white/78 sm:text-base">
            {content.body}
          </p>

          <ContactDetailRows rows={content.details} />
        </Reveal>

        <Reveal
          as="section"
          on="load"
          variant="fade-up"
          delay={0.25}
          className="mt-8 flex items-center lg:mt-0"
        >
          <div className="w-full border border-inverse-surface-1 bg-inverse-canvas p-6 sm:p-8">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-light text-white sm:text-4xl">
                Inquire About Your Journey
              </h2>
              <p className="mt-2 text-sm text-inverse-ink-muted">Confidential inquiry for private aviation services.</p>
            </div>

            <ContactInquiryForm />
          </div>
        </Reveal>
      </div>
      </main>
    </>
  );
}
