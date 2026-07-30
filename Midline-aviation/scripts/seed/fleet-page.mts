import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { FLEET_PAGE } from '../../src/lib/fleet-page-content.js'
import { importMedia } from './lib/media.mjs'
import { importVideo } from './lib/video.mjs'

const force = process.argv.includes('--force')

const run = async () => {
  const payload = await getPayload({ config })
  const existing = (await payload.findGlobal({ slug: 'fleet-page', depth: 0 })) as Record<string, any>
  if (!force && existing?.hero?.heading) {
    console.log('  = fleet page already has content, skipped')
    return
  }
  await payload.updateGlobal({
    slug: 'fleet-page',
    data: {
      hero: {
        heading: FLEET_PAGE.hero.heading,
        body: FLEET_PAGE.hero.body,
        videoUrl: await importVideo(payload, FLEET_PAGE.hero.videoUrl),
        poster: await importMedia(payload, FLEET_PAGE.hero.poster.src, FLEET_PAGE.hero.poster.alt),
      },
      comparison: FLEET_PAGE.comparison,
      interior: {
        heading: FLEET_PAGE.interior.heading,
        link: FLEET_PAGE.interior.link,
        tiles: await Promise.all(
          FLEET_PAGE.interior.tiles.map(async (t) => ({
            image: await importMedia(payload, t.src, t.alt),
            caption: (t as any).caption ?? null,
          }))
        ),
      },
      _status: 'published',
    } as any,
    draft: false,
  })
  console.log('  + fleet page header, comparison, interior gallery')
}

await run()
