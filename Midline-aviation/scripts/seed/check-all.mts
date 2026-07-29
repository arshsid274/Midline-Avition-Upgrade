import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

const payload = await getPayload({ config })
for (const c of ['media', 'accreditations', 'gallery-items', 'aircraft'] as const) {
  const n = await payload.count({ collection: c })
  console.log(`  ${c.padEnd(16)} ${n.totalDocs}`)
}
for (const g of ['home-page','about-page','charter-page','management-page','sales-page','cargo-page','mro-page','contact-page','safety-page','faq-page'] as const) {
  const d = (await payload.findGlobal({ slug: g, depth: 0 })) as any
  const filled = Object.keys(d).filter((k) => !['id','_status','createdAt','updatedAt','globalType'].includes(k)).length
  console.log(`  ${g.padEnd(16)} ${d._status ?? '-'} · ${filled} sections`)
}
