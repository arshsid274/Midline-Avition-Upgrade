import { getPayload } from 'payload'

import config from '../../src/payload.config.js'
import { CONTACT_CONTENT } from '../../src/lib/contact-content.js'

import { importMedia } from './lib/media.mjs'

const force = process.argv.includes('--force')

const run = async () => {
  const payload = await getPayload({ config })
  const existing = (await payload.findGlobal({ slug: 'contact-page', depth: 0 })) as Record<
    string,
    any
  >

  const data: Record<string, unknown> = {}

  if (force || !existing?.hero?.heading) {
    data.hero = {
      eyebrow: CONTACT_CONTENT.eyebrow,
      heading: CONTACT_CONTENT.heading,
      body: CONTACT_CONTENT.body,
      videoUrl: CONTACT_CONTENT.videoUrl,
      poster: await importMedia(payload, CONTACT_CONTENT.poster.src, CONTACT_CONTENT.poster.alt),
    }
    console.log('  + page header & video')
  } else {
    console.log('  = page header already has content, skipped')
  }

  if (force || !existing?.details?.rows?.length) {
    data.details = { rows: CONTACT_CONTENT.details }
    console.log(`  + contact details (${CONTACT_CONTENT.details.length} rows)`)
  } else {
    console.log('  = contact details already has content, skipped')
  }

  if (Object.keys(data).length === 0) {
    console.log('Nothing to write.')
    return
  }

  await payload.updateGlobal({
    slug: 'contact-page',
    data: { ...data, _status: 'published' },
    draft: false,
  })
  console.log('Done — Contact published.')
}

await run()
