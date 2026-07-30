import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { SERVICE_HEROES } from '../../src/lib/service-content.js'
import { importMedia } from './lib/media.mjs'

const force = process.argv.includes('--force')

const run = async () => {
  const payload = await getPayload({ config })

  for (const [slug, hero] of Object.entries(SERVICE_HEROES)) {
    const existing = (await payload.findGlobal({ slug: slug as any, depth: 0 })) as Record<string, any>
    if (!force && existing?.hero?.heading) {
      console.log(`  = ${slug} already has content, skipped`)
      continue
    }
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
        _status: 'published',
      } as any,
      draft: false,
    })
    console.log(`  + ${slug}`)
  }
  console.log('Done — service pages published.')
}

await run()
