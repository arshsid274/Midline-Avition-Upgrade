import { getPayload } from 'payload'

// Relative, not the @/ alias: the Payload CLI transpiles these through tsx,
// which does not read tsconfig paths.
import config from '../../src/payload.config.js'
import { HOME_CTA_BANNER, HOME_HERO } from '../../src/lib/home-content.js'

import { importMedia } from './lib/media.mjs'

/**
 * Seeds the Home Page global from src/lib/home-content.ts.
 *
 *   npm run seed:home            fill only sections that are still empty
 *   npm run seed:home -- --force overwrite everything
 *
 * Importing the real content module rather than parsing JSX means every word
 * of copy and every alt string carries over exactly as written — the same
 * approach that preserved the accreditation alt text.
 *
 * A global is a single row, so unlike the accreditations seed a naive re-run
 * would flatten whatever the client has since typed. By default each section
 * is written only when it is still blank.
 */
const force = process.argv.includes('--force')

const run = async () => {
  const payload = await getPayload({ config })

  const existing = (await payload.findGlobal({ slug: 'home-page', depth: 0 })) as Record<
    string,
    any
  >

  const heroFilled = Boolean(existing?.hero?.heading?.line1)
  const ctaFilled = Boolean(existing?.ctaBanner?.heading)

  const data: Record<string, unknown> = {}

  if (force || !heroFilled) {
    const posterId = await importMedia(payload, HOME_HERO.poster.src, HOME_HERO.poster.alt)
    data.hero = {
      eyebrow: HOME_HERO.eyebrow,
      heading: HOME_HERO.heading,
      body: HOME_HERO.body,
      cta: HOME_HERO.cta,
      videoUrl: HOME_HERO.videoUrl,
      poster: posterId,
    }
    console.log('  + hero')
  } else {
    console.log('  = hero already has content, skipped (use --force to overwrite)')
  }

  if (force || !ctaFilled) {
    data.ctaBanner = {
      heading: HOME_CTA_BANNER.heading,
      body: HOME_CTA_BANNER.body,
      primary: HOME_CTA_BANNER.primary,
      secondary: HOME_CTA_BANNER.secondary,
    }
    console.log('  + blue banner')
  } else {
    console.log('  = blue banner already has content, skipped (use --force to overwrite)')
  }

  if (Object.keys(data).length === 0) {
    console.log('Nothing to write.')
    return
  }

  // Both of these are required, and they do different jobs. `draft: false`
  // decides that the write lands on the live document rather than only in the
  // versions table; `_status: 'published'` decides that the document counts as
  // published. Setting only the flag leaves _status at 'draft' and the live
  // site renders an empty home page.
  await payload.updateGlobal({
    slug: 'home-page',
    data: { ...data, _status: 'published' },
    draft: false,
  })

  console.log('Done — Home Page published.')
}

await run()
