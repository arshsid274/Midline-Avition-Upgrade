import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/app/components/motion/Reveal";

export default function MROOptimizeFleetSection() {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-ibm-blue p-8 text-white sm:p-10 lg:p-12">
          <Reveal as="div" variant="fade-up" className="mx-auto max-w-3xl text-center">
            <p className="text-sm text-white/80">Next Step</p>
            <h2 className="font-display mt-3 text-3xl font-light tracking-[-0.02em] sm:text-4xl">
              Ready to Optimize Your Fleet?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
              Let our engineering and operations teams design a maintenance strategy aligned to your aircraft,
              schedule, and cost goals.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center bg-white px-6 py-3 text-sm font-normal uppercase tracking-wide text-ibm-blue transition-colors hover:bg-surface-1"
              >
                Request MRO Consultation
              </Link>
              <Link
                href="/fleet"
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-white px-6 py-3 text-sm font-normal uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-ibm-blue"
              >
                Explore Fleet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
