import Image from "next/image";
import { ShieldCheck, LineChart } from "lucide-react";
import Reveal from "@/app/components/motion/Reveal";

const standards = [
  {
    title: "Global Regulatory Compliance",
    description: "Navigating international airspace regulations and audit standards with complete operational clarity.",
    icon: ShieldCheck,
  },
  {
    title: "Real-time Financial Reporting",
    description: "Transparent accounting with structured monthly reporting and cost-control visibility for owners.",
    icon: LineChart,
  },
];

export default function AircraftManagementStandardsSection() {
  return (
    <section className="bg-inverse-canvas py-14 sm:py-16 lg:py-20">
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)] lg:gap-16 lg:px-8">
        <Reveal as="div" className="max-w-[38rem] space-y-7" variant="stagger" stagger={0.14}>
          <div data-reveal-item>
            <p className="text-sm text-inverse-ink-muted">
              The Midline Advantage
            </p>
            <h2
              className="font-display mt-3 max-w-[30rem] text-4xl font-light leading-[1.02] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.15rem]"
            >
              Setting New Standards in{" "}
              <span className="font-light italic text-inverse-ink-muted">Operational Excellence</span>
            </h2>
          </div>

          <p data-reveal-item className="max-w-[33rem] text-base leading-relaxed text-inverse-ink-muted">
            We provide industry-leading management solutions focused on safety, compliance, and efficiency. Your
            aircraft is managed by veteran aviation professionals who treat your asset with precision at every step.
          </p>

          <div className="space-y-4">
            {standards.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  data-reveal-item
                  className="max-w-[32rem] bg-inverse-surface-1 p-4"
                >
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-9 w-9 items-center justify-center bg-ibm-blue text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-[0.82rem] leading-relaxed text-inverse-ink-muted">{item.description}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>

        <Reveal
          as="figure"
          variant="clip-wipe"
          duration={0.9}
          className="relative isolate mx-auto w-full max-w-[30rem] overflow-hidden border border-inverse-surface-1"
        >
          <div className="relative aspect-[4/5] min-h-[420px]">
            <Image
              src="/assets/images/aircraft/g450-exterior-portrait.webp"
              alt="Managed Gulfstream G450 on the ramp at Dubai"
              fill
              sizes="(max-width: 1024px) 100vw, 460px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/18 to-transparent" />
          </div>
          <figcaption className="absolute bottom-4 right-4 border border-inverse-surface-1 bg-inverse-canvas px-4 py-3 text-white">
            <p className="text-3xl font-light leading-none text-white">99.8%</p>
            <p className="mt-1 text-xs text-inverse-ink-muted">
              Dispatch Reliability
            </p>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
