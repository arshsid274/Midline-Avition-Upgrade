import { CalendarClock, ConciergeBell, Globe2, ShieldCheck, Sofa } from "lucide-react";
import Reveal from "@/app/components/motion/Reveal";

const reasons = [
  {
    title: "Absolute Flexibility",
    description: "Fly on your schedule, to any airport worldwide.",
    Icon: CalendarClock,
  },
  {
    title: "Refined Comfort",
    description: "Luxury interiors designed for peak relaxation.",
    Icon: Sofa,
  },
  {
    title: "Total Privacy",
    description: "Discreet handling and confidential flight manifests.",
    Icon: ShieldCheck,
  },
  {
    title: "Personalized Attention",
    description: "Your dedicated concierge for every detail.",
    Icon: ConciergeBell,
  },
  {
    title: "Global Access",
    description: "Global network of operators and crew.",
    Icon: Globe2,
  },
];

export default function WhyChooseUsComponent() {
  return (
    <section className="bg-surface-1 py-24">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <Reveal as="div" variant="fade-up" className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-light text-ink md:text-4xl">Why Choose Us</h2>
          <div className="mx-auto h-1 w-20 bg-ibm-blue" />
        </Reveal>

        <Reveal
          as="div"
          variant="stagger"
          stagger={0.12}
          className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5"
        >
          {reasons.map(({ title, description, Icon }) => (
            <article
              key={title}
              data-reveal-item
              className="group border border-hairline bg-white p-8 text-center transition-colors hover:border-ibm-blue"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-ibm-blue/10 text-ibm-blue transition-transform group-hover:scale-110">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-base font-semibold text-ink">{title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{description}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
