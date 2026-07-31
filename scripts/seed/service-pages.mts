import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import {
  SERVICE_FEATURES,
  SERVICE_HEROES,
  SERVICE_SHOWCASES,
} from '../../src/lib/service-content.js'
import { importMedia } from './lib/media.mjs'

const force = process.argv.includes('--force')

const run = async () => {
  const payload = await getPayload({ config })

  for (const [slug, hero] of Object.entries(SERVICE_HEROES)) {
    const existing = (await payload.findGlobal({ slug: slug as any, depth: 0 })) as Record<
      string,
      any
    >

    // Only the hero used to be seeded, so a page can be "already seeded" and
    // still have empty body sections. Treat a populated hero AND populated
    // sections as done — otherwise re-running would never fill the gap.
    const heroDone = Boolean(existing?.hero?.heading)
    const featuresDone = !SERVICE_FEATURES[slug] || (existing?.features?.cards ?? []).length > 0
    const showcaseDone = !SERVICE_SHOWCASES[slug] || (existing?.showcase?.cards ?? []).length > 0

    if (!force && heroDone && featuresDone && showcaseDone) {
      console.log(`  = ${slug} already has content, skipped`)
      continue
    }

    const features = SERVICE_FEATURES[slug]
    const showcase = SERVICE_SHOWCASES[slug]

    await payload.updateGlobal({
      slug: slug as any,
      data: {
        hero: {
          eyebrow: hero.eyebrow,
          heading: hero.heading,
          headingAccent: hero.headingAccent ?? '',
          body: hero.body,
          image: await importMedia(payload, hero.image.src, hero.image.alt),
          // Omit rather than null — a group field set to null throws.
          ...(hero.primary ? { primary: hero.primary } : {}),
          ...(hero.secondary ? { secondary: hero.secondary } : {}),
          ...(hero.stats ? { stats: hero.stats } : {}),
        },

        ...(features
          ? {
              features: {
                eyebrow: features.eyebrow ?? '',
                heading: features.heading,
                intro: features.intro ?? '',
                cards: features.cards.map((card) => ({
                  title: card.title,
                  description: card.description ?? '',
                  icon: card.icon ?? null,
                  points: (card.points ?? []).map((text) => ({ text })),
                })),
              },
            }
          : {}),

        ...(showcase
          ? {
              showcase: {
                eyebrow: showcase.eyebrow ?? '',
                heading: showcase.heading,
                intro: showcase.intro ?? '',
                // Sequential rather than Promise.all: importMedia dedupes on
                // sourcePath by reading first and creating second, so parallel
                // calls for the same file both miss and both upload it.
                cards: await showcase.cards.reduce(
                  async (acc, card) => [
                    ...(await acc),
                    {
                      title: card.title,
                      description: card.description ?? '',
                      image: await importMedia(payload, card.image.src, card.image.alt),
                      ...(card.link ? { link: card.link } : {}),
                    },
                  ],
                  Promise.resolve([] as any[])
                ),
              },
            }
          : {}),

        _status: 'published',
      } as any,
      draft: false,
    })

    const wrote = [
      'hero',
      features && `${features.cards.length} feature cards`,
      showcase && `${showcase.cards.length} picture cards`,
    ]
      .filter(Boolean)
      .join(', ')
    console.log(`  + ${slug} — ${wrote}`)
  }
  console.log('Done — service pages published.')
}

await run()
