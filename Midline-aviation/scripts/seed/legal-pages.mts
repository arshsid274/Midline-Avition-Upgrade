import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

const run = async () => {
  const payload = await getPayload({ config })
  const existing = (await payload.findGlobal({ slug: 'legal-pages', depth: 0 })) as Record<string, any>
  if (existing?.privacy?.title) {
    console.log('  = legal pages already populated, skipped')
    return
  }
  await payload.updateGlobal({
    slug: 'legal-pages',
    data: {
      privacy: { title: 'Privacy Policy', updated: 'July 2026' },
      terms: { title: 'Terms & Conditions', updated: 'July 2026' },
      cookies: { title: 'Cookie Policy', updated: 'July 2026' },
      _status: 'published',
    } as any,
    draft: false,
  })
  console.log('  + privacy, terms, cookies')
}

await run()
