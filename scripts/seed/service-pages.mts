/**
 * Seeds the five service globals from the constants in service-content.ts.
 *
 *   npx payload run scripts/seed/service-pages.mts
 *   npx payload run scripts/seed/service-pages.mts --only=sales-page
 *   npx payload run scripts/seed/service-pages.mts --only=cargo-page --section=hero --force
 *
 * --only and --section exist because a bare --force rewrites all five pages,
 * including sections a client may already have edited. Narrow the blast radius
 * to the thing you actually mean to reset.
 *
 * Idempotent without --force: a section is skipped when it already holds
 * content, so re-running fills gaps rather than clobbering.
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config.js'
import {
  SERVICE_CHIPS,
  SERVICE_CLOSINGS,
  SERVICE_FEATURES,
  SERVICE_HEROES,
  SERVICE_INTROS,
  SERVICE_SHOWCASES,
  SERVICE_STANDARDS,
  type ServiceSlug,
} from '../../src/lib/service-content.js'
import { importMedia } from './lib/media.mjs'

const arg = (name: string) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1]

const force = process.argv.includes('--force')
const only = arg('only')
const onlySection = arg('section')

const wants = (section: string) => !onlySection || onlySection === section

/**
 * importMedia dedupes by reading first and creating second, so two concurrent
 * calls for the same file both miss and both upload it. Sequential by design —
 * this is why it is a reduce rather than a Promise.all.
 */
const mapSeries = async <T, R>(items: T[], fn: (item: T) => Promise<R>): Promise<R[]> =>
  items.reduce<Promise<R[]>>(
    async (acc, item) => [...(await acc), await fn(item)],
    Promise.resolve([])
  )

const payload = await getPayload({ config })

const entries = Object.entries(SERVICE_HEROES) as [ServiceSlug, (typeof SERVICE_HEROES)[ServiceSlug]][]

for (const [slug, hero] of entries) {
  if (only && only !== slug) continue

  const existing = (await payload.findGlobal({ slug: slug as any, depth: 0 })) as Record<string, any>

  const features = SERVICE_FEATURES[slug]
  const showcase = SERVICE_SHOWCASES[slug]
  const standards = SERVICE_STANDARDS[slug]
  const intro = SERVICE_INTROS[slug]
  const chips = SERVICE_CHIPS[slug]
  const closing = SERVICE_CLOSINGS[slug]

  // A page can be "already seeded" from when only the hero was written, so
  // completeness is judged per section rather than by the hero alone.
  const done =
    Boolean(existing?.hero?.heading) &&
    (!features || (existing?.features?.cards ?? []).length > 0) &&
    (!showcase || (existing?.showcase?.cards ?? []).length > 0) &&
    (!standards || (existing?.standards?.cards ?? []).length > 0) &&
    (!intro || (existing?.intro?.paragraphs ?? []).length > 0) &&
    (!chips || (existing?.services?.chips ?? []).length > 0) &&
    (!closing || Boolean(existing?.closing?.heading))

  if (!force && done) {
    console.log(`  = ${slug} already complete, skipped`)
    continue
  }

  const data: Record<string, any> = { _status: 'published' }
  const wrote: string[] = []

  if (wants('hero')) {
    data.hero = {
      eyebrow: hero.eyebrow,
      heading: hero.heading,
      headingAccent: hero.headingAccent ?? '',
      headingRest: hero.headingRest ?? '',
      body: hero.body,
      ...(hero.bodySecondary ? { bodySecondary: hero.bodySecondary } : {}),
      ...(hero.footnote ? { footnote: hero.footnote } : {}),
      image: await importMedia(payload, hero.image.src, hero.image.alt),
      // Omitted rather than null — a group field set to null throws.
      ...(hero.primary ? { primary: hero.primary } : {}),
      ...(hero.secondary ? { secondary: hero.secondary } : {}),
      ...(hero.stats ? { stats: hero.stats } : {}),
    }
    wrote.push('hero')
  }

  if (standards && wants('standards')) {
    data.standards = {
      eyebrow: standards.eyebrow,
      heading: standards.heading,
      headingAccent: standards.headingAccent ?? '',
      intro: standards.intro,
      cards: standards.cards.map((card) => ({
        title: card.title,
        description: card.description ?? '',
        icon: card.icon ?? null,
      })),
      image: await importMedia(payload, standards.image.src, standards.image.alt),
      figureValue: standards.figureValue,
      figureLabel: standards.figureLabel,
    }
    wrote.push('standards')
  }

  if (intro && wants('intro')) {
    data.intro = {
      eyebrow: intro.eyebrow,
      heading: intro.heading,
      paragraphs: intro.paragraphs.map((text) => ({ text })),
    }
    wrote.push(`intro (${intro.paragraphs.length} paragraphs)`)
  }

  if (features && wants('features')) {
    data.features = {
      eyebrow: features.eyebrow ?? '',
      heading: features.heading,
      intro: features.intro ?? '',
      cards: features.cards.map((card) => ({
        title: card.title,
        description: card.description ?? '',
        icon: card.icon ?? null,
        points: (card.points ?? []).map((text) => ({ text })),
        ...(card.featured !== undefined ? { featured: card.featured } : {}),
      })),
    }
    wrote.push(`${features.cards.length} feature cards`)
  }

  if (showcase && wants('showcase')) {
    data.showcase = {
      eyebrow: showcase.eyebrow ?? '',
      heading: showcase.heading,
      intro: showcase.intro ?? '',
      cards: await mapSeries(showcase.cards, async (card) => ({
        title: card.title,
        description: card.description ?? '',
        image: await importMedia(payload, card.image.src, card.image.alt),
        ...(card.badge ? { badge: card.badge } : {}),
        ...(card.icon ? { icon: card.icon } : {}),
        ...(card.link ? { link: card.link } : {}),
      })),
      ...(showcase.stats ? { stats: showcase.stats } : {}),
    }
    wrote.push(`${showcase.cards.length} picture cards`)
  }

  if (chips && wants('services')) {
    data.services = {
      eyebrow: chips.eyebrow,
      heading: chips.heading,
      intro: chips.intro,
      chips: chips.chips.map((chip) => ({ label: chip.label, icon: chip.icon ?? null })),
    }
    wrote.push(`${chips.chips.length} chips`)
  }

  if (closing && wants('closing')) {
    data.closing = {
      eyebrow: closing.eyebrow,
      heading: closing.heading,
      body: closing.body,
      ...(closing.cta ? { cta: closing.cta } : {}),
    }
    wrote.push('closing band')
  }

  if (wrote.length === 0) {
    console.log(`  = ${slug} nothing matched --section=${onlySection}`)
    continue
  }

  // Both are required and do different jobs: `draft: false` targets the
  // published document, `_status` sets what that document says it is. Setting
  // only the flag leaves _status at 'draft' and the live site renders nothing.
  await payload.updateGlobal({ slug: slug as any, data: data as any, draft: false })
  console.log(`  + ${slug} — ${wrote.join(', ')}`)
}

console.log('Done — service pages published.')
