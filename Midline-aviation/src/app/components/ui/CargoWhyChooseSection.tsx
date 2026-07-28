import { Globe, ShieldCheck, SlidersHorizontal } from "lucide-react";
import Reveal from "@/app/components/motion/Reveal";

const advantages = [
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "An interconnected logistics network spanning over 180 destinations across six continents — ensuring your cargo moves without borders.",
    points: ["Multi-hub routing", "Regional partner network", "Customs clearance support"],
    featured: false,
  },
  {
    icon: ShieldCheck,
    title: "Unmatched Security",
    description:
      "Industry-leading cargo security protocols from point of origin to final delivery. Full chain-of-custody tracking and tamper-evident packaging.",
    points: ["End-to-end chain of custody", "24/7 real-time tracking", "Certified secure handling"],
    featured: true,
  },
  {
    icon: SlidersHorizontal,
    title: "Customized Solutions",
    description:
      "Bespoke logistics configurations designed around your cargo type, timeline, and compliance requirements. No two shipments are the same.",
    points: ["Temperature-sensitive cargo", "Oversized & heavy lift", "Hazmat certified handling"],
    featured: false,
  },
];

export default function CargoWhyChooseSection() {
  return (
    <section className="bg-inverse-canvas py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal as="div" variant="fade-up" className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
          <p className="text-sm text-inverse-ink-muted">Core Advantages</p>
          <h2
            className="font-display mt-3 text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.6rem]"
          >
            Why Choose Midline Cargo?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-inverse-ink-muted sm:text-base">
            Built on decades of aviation expertise, our cargo division delivers reliability, security, and precision on
            every route we operate.
          </p>
        </Reveal>

        {/* Cards grid */}
        <Reveal as="div" variant="stagger" stagger={0.12} className="grid gap-5 md:grid-cols-3">
          {advantages.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                data-reveal-item
                className={`relative overflow-hidden border p-6 transition-colors ${
                  item.featured
                    ? "border-ibm-blue bg-inverse-surface-1"
                    : "border-inverse-surface-1 bg-inverse-surface-1 hover:border-ink-subtle"
                }`}
              >
                <span
                  className={`relative inline-flex h-12 w-12 items-center justify-center ${
                    item.featured ? "bg-ibm-blue text-white" : "bg-inverse-canvas text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="relative mt-5 text-xl font-normal text-white">{item.title}</h3>
                <p className="relative mt-2.5 text-sm leading-relaxed text-inverse-ink-muted">{item.description}</p>

                <ul className="relative mt-5 space-y-2.5">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-inverse-ink-muted">
                      <span aria-hidden className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-ibm-blue" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {item.featured && (
                  <div className="relative mt-6 border-t border-white/10 pt-4">
                    <p className="text-xs text-inverse-ink-muted">
                      Industry-leading standard
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
