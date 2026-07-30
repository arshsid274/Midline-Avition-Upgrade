import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { FAQ_GROUPS, FAQ_PAGE } from '../../src/lib/faq-content.js'

const force = process.argv.includes('--force')

const run = async () => {
  const payload = await getPayload({ config })
  const existing = (await payload.findGlobal({ slug: 'faq-page', depth: 0 })) as Record<string, any>
  if (!force && existing?.groups?.items?.length) {
    console.log('  = faq already has content, skipped (use --force)')
    return
  }
  await payload.updateGlobal({
    slug: 'faq-page',
    data: {
      hero: FAQ_PAGE.hero,
      groups: {
        items: FAQ_GROUPS.map((g) => ({
          heading: g.heading,
          questions: g.items.map((qa) => ({ q: qa.q, a: qa.a })),
        })),
      },
      closing: FAQ_PAGE.closing,
      _status: 'published',
    } as any,
    draft: false,
  })
  const total = FAQ_GROUPS.reduce((n, g) => n + g.items.length, 0)
  console.log(`  + ${FAQ_GROUPS.length} groups, ${total} questions`)
  console.log('Done — FAQ published.')
}

await run()
