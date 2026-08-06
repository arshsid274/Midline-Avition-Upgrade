import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import FlightPathLine from "@/app/components/ui/FlightPathLine";
import { SITE_NAME } from "@/lib/seo";

const footerColumns = [
  {
    heading: "Aircraft",
    links: [
      { label: "Gulfstream G450", href: "/fleet/gulfstream-g450" },
      { label: "Gulfstream G200", href: "/fleet/gulfstream-g200" },
      { label: "Embraer Legacy 650", href: "/fleet/embraer-legacy-650" },
      { label: "View Full Fleet", href: "/fleet" },
      { label: "Pre-Owned", href: "/services/aircraft-sales" },
    ],
  },
  {
    heading: "Ownership",
    links: [
      { label: "Fleet Support", href: "/services/aircraft-management" },
      { label: "Designing Your Flight", href: "/services/aircraft-charter" },
      { label: "Customer Services", href: "/contact" },
      { label: "Updating Your Aircraft", href: "/services/aircraft-management" },
    ],
  },
  {
    heading: "About Us",
    links: [
      { label: "Midline Aviation", href: "/about" },
      { label: "Safety & Certifications", href: "/safety" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Book a Flight", href: "/#book-your-flight" },
    ],
  },
] as const;

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/midline.aviation/", Icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/midline.aviation/", Icon: Facebook },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/midline-aviation/", Icon: Linkedin },
] as const;

export default function SiteFooter() {
  return (
    // Deep-navy footer (client brief §9): #0A2632 ground, stronger logo, thin
    // champagne dividers, generous breathing room, controlled legal/social
    // hierarchy.
    <footer className="w-full bg-inverse-canvas px-6 pt-24 pb-14 text-inverse-ink-muted md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        {/* The logo PNG is dark navy, so it gets the off-white filter treatment
            on this surface until the final logo arrives. */}
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label={`${SITE_NAME} home`}>
            <Image
              src="/assets/images/Midline_Airlines.png"
              alt={SITE_NAME}
              width={734}
              height={340}
              className="h-14 w-auto object-contain sm:h-16 [filter:brightness(0)_invert(0.93)_sepia(0.14)]"
            />
          </Link>
        </div>

        {/* Brand device: champagne flight-path divider */}
        <div className="mb-16 flex justify-center">
          <FlightPathLine width={160} />
        </div>

        {/* Link columns */}
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          {footerColumns.map((column) => (
            <div key={column.heading}>
              <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-champagne">
                {column.heading}
              </h3>
              <ul className="space-y-4 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="link-underline text-inverse-ink-muted transition-colors duration-300 hover:text-champagne"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between border-t border-champagne/20 pt-8 text-xs md:flex-row">
          <div className="mb-6 flex flex-col items-center gap-3 md:mb-0 md:flex-row md:gap-4">
            <p>
              &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </p>
            <nav aria-label="Legal" className="flex items-center gap-3">
              <Link href="/privacy-policy" className="link-underline transition-colors hover:text-champagne">
                Privacy
              </Link>
              <span aria-hidden className="text-champagne/40">·</span>
              <Link href="/terms-and-conditions" className="link-underline transition-colors hover:text-champagne">
                Terms
              </Link>
              <span aria-hidden className="text-champagne/40">·</span>
              <Link href="/cookie-policy" className="link-underline transition-colors hover:text-champagne">
                Cookies
              </Link>
            </nav>
          </div>
          <div className="flex gap-6">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-inverse-ink-muted transition-colors duration-300 hover:text-champagne"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
