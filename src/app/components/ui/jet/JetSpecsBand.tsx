import type { Jet } from "@/lib/fleet";
import Reveal from "@/app/components/motion/Reveal";
import CountUp from "@/app/components/motion/CountUp";

export default function JetSpecsBand({ jet }: { jet: Jet }) {
  return (
    <section
      aria-label={`${jet.name} performance`}
      className="bg-inverse-canvas py-14 sm:py-16"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal as="div" variant="fade-up" className="mb-10 max-w-3xl">
          <p className="text-sm text-inverse-ink-muted">Performance</p>
          <h2 className="font-display mt-3 text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl">
            {jet.name} at a glance
          </h2>
        </Reveal>

        <Reveal
          as="dl"
          variant="stagger"
          stagger={0.08}
          className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-5"
        >
          {jet.specs.map((spec) => (
            <div key={spec.label} data-reveal-item className="border-l border-inverse-surface-1 pl-4">
              <dt className="text-xs text-inverse-ink-muted">
                {spec.label}
              </dt>
              <dd className="mt-2">
                <span className="text-3xl font-light leading-none text-white sm:text-4xl">
                  {spec.displayValue ?? <CountUp value={spec.value} />}
                  {spec.unit && !spec.displayValue && (
                    <span className="ml-1.5 font-mono text-base font-normal text-inverse-ink-muted">{spec.unit}</span>
                  )}
                </span>
                <p className="mt-2 text-[0.72rem] text-inverse-ink-muted">{spec.note}</p>
              </dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
