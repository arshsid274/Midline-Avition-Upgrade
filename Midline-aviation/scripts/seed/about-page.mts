import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import {
  ABOUT_LEADERSHIP,
  ABOUT_PAGE,
  ABOUT_STORY,
  ABOUT_SUSTAINABILITY,
  featureSlides,
  leadershipMembers,
} from '../../src/lib/about-content.js'
import { importMedia } from './lib/media.mjs'

const force = process.argv.includes('--force')

const run = async () => {
  const payload = await getPayload({ config })
  const existing = (await payload.findGlobal({ slug: 'about-page', depth: 0 })) as Record<string, any>
  if (!force && existing?.whatWeDo?.slides?.length) {
    console.log('  = about already has content, skipped (use --force)')
    return
  }

  const data = {
    whatWeDo: {
      heading: ABOUT_PAGE.whatWeDo.heading,
      slides: await Promise.all(
        featureSlides.map(async (s) => ({
          label: s.label,
          title: s.title,
          description: s.description,
          image: await importMedia(payload, s.imageSrc, s.imageAlt),
          link: { label: 'Book now', href: s.ctaHref },
          imagePosition: s.imagePosition,
        }))
      ),
    },
    story: {
      heading: ABOUT_STORY.heading,
      paragraphs: ABOUT_STORY.paragraphs.map((text) => ({ text })),
      image: await importMedia(payload, ABOUT_STORY.image.src, ABOUT_STORY.image.alt),
    },
    sustainability: {
      eyebrow: ABOUT_SUSTAINABILITY.eyebrow,
      heading: ABOUT_SUSTAINABILITY.heading,
      intro: ABOUT_SUSTAINABILITY.intro,
      image: await importMedia(payload, ABOUT_SUSTAINABILITY.image.src, ABOUT_SUSTAINABILITY.image.alt),
      cardTitle: ABOUT_SUSTAINABILITY.cardTitle,
      cardBody: ABOUT_SUSTAINABILITY.cardBody,
      points: ABOUT_SUSTAINABILITY.points.map((text) => ({ text })),
      link: ABOUT_SUSTAINABILITY.link,
    },
    leadership: {
      eyebrow: ABOUT_LEADERSHIP.eyebrow,
      heading: ABOUT_LEADERSHIP.heading,
      intro: ABOUT_LEADERSHIP.intro,
      members: await Promise.all(
        leadershipMembers.map(async (m) => ({
          name: m.name,
          title: m.title,
          bio: m.bio,
          photo: await importMedia(payload, m.imageSrc, `${m.name}, ${m.title}`),
          objectPosition: (m as any).objectPosition ?? null,
        }))
      ),
    },
    _status: 'published',
  }

  await payload.updateGlobal({ slug: 'about-page', data: data as any, draft: false })
  console.log(`  + what we do (${featureSlides.length} tabs), story, sustainability, leadership (${leadershipMembers.length} people)`)
  console.log('Done — About published.')
}

await run()
