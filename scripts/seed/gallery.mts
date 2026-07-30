import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { GALLERY_ITEMS } from '../../src/lib/gallery-content.js'
import { importMedia } from './lib/media.mjs'
import { importVideo } from './lib/video.mjs'

const run = async () => {
  const payload = await getPayload({ config })
  let created = 0
  let skipped = 0

  for (const [index, item] of GALLERY_ITEMS.entries()) {
    const isVideo = Boolean(item.poster)
    // Idempotent on caption + order, the pair that identifies a tile.
    const existing = await payload.find({
      collection: 'gallery-items',
      where: { and: [{ caption: { equals: item.caption } }, { order: { equals: index } }] },
      limit: 1,
      pagination: false,
    })
    if (existing.docs.length) {
      skipped++
      continue
    }

    await payload.create({
      collection: 'gallery-items',
      data: {
        kind: isVideo ? 'video' : 'image',
        ...(isVideo
          ? {
              videoUrl: await importVideo(payload, item.src),
              poster: await importMedia(payload, item.poster!, item.alt),
            }
          : { image: await importMedia(payload, item.src, item.alt) }),
        caption: item.caption,
        alt: item.alt,
        category: item.category,
        orientation: item.orientation,
        order: index,
      } as any,
    })
    created++
  }

  const total = await payload.count({ collection: 'gallery-items' })
  console.log(`  created ${created}, skipped ${skipped} — ${total.totalDocs} gallery items total`)
}

await run()
