import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

const payload = await getPayload({ config })
const g = (await payload.findGlobal({ slug: 'home-page', depth: 1 })) as any
console.log('_status:', g._status)
const rows: [string, unknown][] = [
  ['1 hero',           g.hero?.heading?.line1],
  ['2 showcase',       `${g.showcase?.heading} (${g.showcase?.panels?.length ?? 0} panels)`],
  ['3 destinations',   `${g.destinations?.heading} (${g.destinations?.cards?.length ?? 0} cards)`],
  ['4 services',       `${g.services?.heading} (${g.services?.cards?.length ?? 0} cards)`],
  ['5 accreditations', g.accreditations?.heading],
  ['6 fleet',          `${g.fleet?.heading} (${g.fleet?.cards?.length ?? 0} cards)`],
  ['7 cta banner',     g.ctaBanner?.heading],
]
for (const [k, v] of rows) console.log(`  ${k.padEnd(18)} ${v}`)
const media = await payload.count({ collection: 'media' })
console.log('media docs:', media.totalDocs)
