import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Jet } from "@/lib/fleet";
import Reveal from "@/app/components/motion/Reveal";
import SplitHeading from "@/app/components/motion/SplitHeading";
import JetHeroVideo from "./JetHeroVideo";

export default function JetHero({ jet }: { jet: Jet }) {
  return (
    <section className="relative isolate h-[calc(92svh-72px)] w-full overflow-hidden md:h-[calc(92svh-84px)]">
      {/* Poster image is always the LCP element; the video mounts after idle. */}
      <Image
        src={jet.hero.image.src}
        alt={jet.hero.image.alt}
        fill
        sizes="100vw"
        className="object-cover object-center hero-kenburns"
        priority
      />
      {jet.hero.video && <JetHeroVideo src={jet.hero.video.src} poster={jet.hero.image.src} />}

      <div className="absolute inset-0 bg-gradient-to-r from-black/62 via-black/28 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />

      <div className="relative mx-auto flex h-full w-full max-w-[1400px] flex-col justify-end px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex items-center gap-2 text-xs font-medium text-white/70">
            <li>
              <Link href="/fleet" className="transition-colors hover:text-white">
                Fleet
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-white">{jet.name}</li>
          </ol>
        </nav>

        <div className="max-w-[44rem]">
          <Reveal as="div" on="load" variant="fade-up" delay={0.05}>
            <span className="inline-flex items-center gap-2.5 text-sm text-white/80">
              {jet.category}
              <span aria-hidden className="h-1 w-1 rounded-full bg-white/60" />
              <span className="font-mono">{jet.tail}</span>
            </span>
          </Reveal>

          <SplitHeading
            as="h1"
            mode="lcp"
            on="load"
            delay={0.15}
            className="font-display mt-4 text-4xl font-light leading-[1.04] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl"
          >
            {jet.name}
          </SplitHeading>

          <Reveal as="div" on="load" variant="fade-up" delay={0.45}>
            <p className="mt-4 max-w-[36rem] text-sm leading-relaxed text-white/85 sm:text-base">{jet.tagline}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-ibm-blue px-6 py-3 text-sm font-normal uppercase tracking-wide text-white transition-colors hover:bg-ibm-blue-hover"
              >
                Request Charter
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/fleet"
                className="inline-flex min-h-11 items-center justify-center border border-white/80 px-6 py-3 text-sm font-normal uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-ink"
              >
                Compare Fleet
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
