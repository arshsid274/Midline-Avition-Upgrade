import { getPayload } from 'payload'

// Relative, not the @/ alias: the Payload CLI transpiles these through tsx,
// which does not read tsconfig paths.
import config from '../../src/payload.config.js'

/**
 * Round-trips a linked gallery item: creates one and proves an unreadable link
 * is rejected at save rather than vanishing silently from the page.
 *
 *   npx payload run scripts/seed/check-embeds.mts           create
 *   WIPE=1 npx payload run scripts/seed/check-embeds.mts    remove it again
 *
 * An environment variable rather than a flag: `payload run` consumes its own
 * argv and does not forward trailing arguments to the script.
 *
 * The mapper is not imported here — src/lib/cms/gallery.ts is "server-only" and
 * cannot load outside Next — so confirm the tile itself by loading /gallery.
 */
const CAPTION = 'TEMP embed smoke test'

const payload = await getPayload({ config })

const wipe = async () => {
  const { docs } = await payload.find({
    collection: 'gallery-items',
    where: { caption: { equals: CAPTION } },
    limit: 10,
  })
  for (const doc of docs) await payload.delete({ collection: 'gallery-items', id: doc.id })
  return docs.length
}

if (process.env.WIPE) {
  console.log(`removed ${await wipe()} test item(s)`)
} else {
  await wipe()

  const created = await payload.create({
    collection: 'gallery-items',
    data: {
      kind: 'link',
      embedUrl: 'https://youtu.be/dQw4w9WgXcQ',
      caption: CAPTION,
      alt: 'Linked film smoke test',
      category: 'Services',
      orientation: 'landscape',
      order: 999,
    },
  })
  console.log(`created #${created.id} — now load /gallery to see the tile`)

  try {
    await payload.create({
      collection: 'gallery-items',
      data: {
        kind: 'link',
        embedUrl: 'https://example.com/not-media',
        caption: CAPTION,
        alt: 'should not save',
        category: 'Services',
        orientation: 'landscape',
      },
    })
    console.log('FAIL: an unreadable link saved')
  } catch {
    console.log('ok: unreadable link rejected at save')
  }
}
