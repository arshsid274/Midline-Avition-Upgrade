import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { JETS } from '../../src/lib/fleet.js'
import { importMedia } from './lib/media.mjs'
import { importVideo } from './lib/video.mjs'

const run = async () => {
  const payload = await getPayload({ config })
  let created = 0
  let skipped = 0

  for (const [index, jet] of JETS.entries()) {
    const existing = await payload.find({
      collection: 'aircraft',
      where: { slug: { equals: jet.slug } },
      limit: 1,
      pagination: false,
    })
    if (existing.docs.length) {
      console.log(`  = ${jet.slug} exists, skipped`)
      skipped++
      continue
    }

    await payload.create({
      collection: 'aircraft',
      data: {
        name: jet.name,
        tail: jet.tail,
        category: jet.category,
        tagline: jet.tagline,
        description: jet.description.map((text) => ({ text })),
        specs: jet.specs.map((s) => ({
          label: s.label,
          value: s.value,
          unit: s.unit,
          decimals: s.decimals ?? null,
          note: s.note,
          displayValue: s.displayValue ?? null,
        })),
        heroImage: await importMedia(payload, jet.hero.image.src, jet.hero.image.alt),
        heroVideoUrl: jet.hero.video?.src ? await importVideo(payload, jet.hero.video.src) : null,
        gallery: await Promise.all(
          jet.gallery.map(async (image) => ({
            image: await importMedia(payload, image.src, image.alt),
            span: image.span ?? 'standard',
          }))
        ),
        ...(jet.verticalVideo
          ? {
              verticalVideo: {
                url: await importVideo(payload, jet.verticalVideo.src),
                poster: await importMedia(
                  payload,
                  jet.verticalVideo.poster,
                  `${jet.name} cabin tour still`
                ),
                heading: jet.verticalVideo.heading,
                caption: jet.verticalVideo.caption,
              },
            }
          : {}),
        slug: jet.slug,
        seoTitle: jet.seo.title,
        seoDescription: jet.seo.description,
        seoKeywords: jet.seo.keywords.map((keyword) => ({ keyword })),
        ogImage: jet.ogImage,
        order: index,
      } as any,
    })
    console.log(`  + ${jet.slug} (${jet.gallery.length} photos)`)
    created++
  }

  const total = await payload.count({ collection: 'aircraft' })
  console.log(`created ${created}, skipped ${skipped} — ${total.totalDocs} aircraft total`)
}

await run()
