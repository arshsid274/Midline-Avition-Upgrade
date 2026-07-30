import Image from "next/image";
import { ShieldCheck, Wrench, TimerReset } from "lucide-react";
import Reveal from "@/app/components/motion/Reveal";

const pillars = [
  {
    title: "Certified Procedures",
    description: "Maintenance actions aligned with OEM documentation and authority-approved programs.",
    icon: ShieldCheck,
  },
  {
    title: "Rapid Turnaround",
    description: "Planning and execution designed to reduce downtime and return aircraft to service faster.",
    icon: TimerReset,
  },
  {
    title: "Predictive Oversight",
    description: "Technical forecasting and lifecycle monitoring to prevent costly unscheduled interruptions.",
    icon: Wrench,
  },
];

export default function MROFoundationSection() {
  return (
    <section className="bg-white py-12 sm:py-14 lg:py-16">
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-14 lg:px-8">
        <Reveal as="div" className="space-y-7" variant="stagger" stagger={0.14}>
          <div data-reveal-item>
            <p className="text-sm text-ink-muted">
              Operational Integrity
            </p>
            <h2
              className="font-display mt-3 text-3xl font-light leading-[1.12] tracking-[-0.02em] text-ink sm:text-4xl lg:text-[2.8rem]"
            >
              The Foundation of Safe Travel
            </h2>
          </div>

          <p data-reveal-item className="max-w-2xl text-base leading-relaxed text-ink-muted">
            Our MRO framework is built on strict process control, transparent reporting, and engineering precision.
            Every check, repair, and overhaul is executed to elevate safety and long-term reliability.
          </p>

          <div className="space-y-3">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  data-reveal-item
                  className="border border-hairline bg-surface-1 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center bg-surface-2 text-ink">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.description}</p>
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
          className="relative isolate mx-auto w-full max-w-[32rem] overflow-hidden border border-hairline"
        >
          <div className="relative aspect-[4/5] min-h-[420px]">
            <Image
              src="/assets/images/aircraft/g450-detail.webp"
              alt="Rolls-Royce Tay engine nacelle under inspection"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/56 via-black/10 to-transparent" />
          </div>
          <figcaption className="absolute bottom-4 right-4 border border-inverse-surface-1 bg-inverse-canvas px-4 py-3 text-white">
            <p className="text-3xl font-light leading-none text-ibm-blue">99.6%</p>
            <p className="mt-1 text-xs text-inverse-ink-muted">
              On-Time Completion
            </p>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
