import { getPayload } from 'payload'

// Relative, not the @/ alias: the Payload CLI transpiles these through tsx,
// which does not read tsconfig paths.
import config from '../../src/payload.config.js'
import {
  HOME_AIRCRAFT,
  HOME_CTA_BANNER,
  HOME_HERO,
  HOME_SERVICES,
  POPULAR_DESTINATIONS,
  SHOWCASE_ITEMS,
} from '../../src/lib/home-content.js'

import { importMedia } from './lib/media.mjs'
import { importVideo } from './lib/video.mjs'

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

  /**
   * Start from the sections already in the database, then let the blocks below
   * overwrite the ones being (re)seeded.
   *
   * updateGlobal validates exactly the data it is handed — a skipped section is
   * absent from the update, and its required fields (the hero video, for one)
   * fail publish validation even though the stored document has them. That
   * never bit while the seed only ran against a blank database, where every
   * section is written in one shot; it surfaces the moment a new section is
   * added to an already-seeded site. Read at depth 0, relationships are IDs,
   * which is exactly the shape update expects back.
   */
  const SECTIONS = [
    'hero',
    'showcase',
    'destinations',
    'services',
    'accreditations',
    'fleet',
    'ctaBanner',
  ] as const

  const data: Record<string, unknown> = {}
  let wrote = 0
  for (const section of SECTIONS) {
    if (existing?.[section] !== undefined) data[section] = existing[section]
  }

  if (force || !heroFilled) {
    const posterId = await importMedia(payload, HOME_HERO.poster.src, HOME_HERO.poster.alt)
    data.hero = {
      eyebrow: HOME_HERO.eyebrow,
      heading: HOME_HERO.heading,
      body: HOME_HERO.body,
      cta: HOME_HERO.cta,
      videoUrl: await importVideo(payload, HOME_HERO.videoUrl),
      poster: posterId,
    }
    console.log('  + hero')
    wrote += 1
  } else {
    console.log('  = hero already has content, skipped (use --force to overwrite)')
  }

  if (force || !existing?.showcase?.panels?.length) {
    data.showcase = {
      heading: 'Discover Midline',
      panels: await Promise.all(
        SHOWCASE_ITEMS.map(async (item) => ({
          title: item.title,
          subtitle: item.subtitle,
          description: item.description,
          image: await importMedia(payload, item.imageSrc, item.imageAlt),
          link: { label: item.ctaLabel, href: item.href },
          imageOnRight: Boolean(item.reverse),
        }))
      ),
    }
    console.log(`  + discover midline (${SHOWCASE_ITEMS.length} panels)`)
    wrote += 1
  } else {
    console.log('  = discover midline already has content, skipped')
  }

  if (force || !existing?.destinations?.cards?.length) {
    data.destinations = {
      heading: 'Frequent travel destinations',
      cards: await Promise.all(
        POPULAR_DESTINATIONS.map(async (item) => ({
          title: item.name,
          image: await importMedia(payload, item.imageSrc, item.imageAlt),
          link: { label: item.name, href: item.href },
        }))
      ),
    }
    console.log(`  + destinations (${POPULAR_DESTINATIONS.length} cards)`)
    wrote += 1
  } else {
    console.log('  = destinations already has content, skipped')
  }

  if (force || !existing?.services?.cards?.length) {
    data.services = {
      eyebrow: HOME_SERVICES.eyebrow,
      heading: HOME_SERVICES.heading,
      intro: HOME_SERVICES.intro,
      cards: await Promise.all(
        HOME_SERVICES.cards.map(async (item) => ({
          title: item.title,
          description: item.description,
          tag: item.tag ?? '',
          image: await importMedia(payload, item.imageSrc, item.imageAlt),
          link: { label: item.ctaLabel, href: item.href },
        }))
      ),
    }
    console.log(`  + our services (${HOME_SERVICES.cards.length} cards)`)
    wrote += 1
  } else {
    console.log('  = our services already has content, skipped')
  }

  if (force || !existing?.accreditations?.heading) {
    data.accreditations = { heading: 'Accreditations & Memberships' }
    console.log('  + accreditations strip')
    wrote += 1
  } else {
    console.log('  = accreditations strip already has content, skipped')
  }

  if (force || !existing?.fleet?.cards?.length) {
    data.fleet = {
      eyebrow: 'Fleet',
      heading: 'Our Fleet',
      cards: await Promise.all(
        HOME_AIRCRAFT.map(async (item) => ({
          title: item.name,
          description: item.description,
          registration: item.registration,
          comingSoon: Boolean(item.comingSoon),
          image: await importMedia(payload, item.imageSrc, item.imageAlt),
          link: { label: 'More Details', href: item.href },
          videoUrl: item.videoSrc ? await importVideo(payload, item.videoSrc) : null,
        }))
      ),
    }
    console.log(`  + our fleet (${HOME_AIRCRAFT.length} cards)`)
    wrote += 1
  } else {
    console.log('  = our fleet already has content, skipped')
  }

  if (force || !ctaFilled) {
    data.ctaBanner = {
      heading: HOME_CTA_BANNER.heading,
      body: HOME_CTA_BANNER.body,
      primary: HOME_CTA_BANNER.primary,
      secondary: HOME_CTA_BANNER.secondary,
    }
    console.log('  + blue banner')
    wrote += 1
  } else {
    console.log('  = blue banner already has content, skipped (use --force to overwrite)')
  }

  if (wrote === 0) {
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
