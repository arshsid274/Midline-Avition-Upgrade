import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

const payload = await getPayload({ config })
const v = await payload.count({ collection: 'videos' })
console.log('videos in library:', v.totalDocs)

const home = (await payload.findGlobal({ slug: 'home-page', depth: 1 })) as any
console.log('home hero film   :', home.hero?.videoUrl?.url ?? '(none)')
const contact = (await payload.findGlobal({ slug: 'contact-page', depth: 1 })) as any
console.log('contact film     :', contact.hero?.videoUrl?.url ?? '(none)')
const fleet = (await payload.findGlobal({ slug: 'fleet-page', depth: 1 })) as any
console.log('fleet film       :', fleet.hero?.videoUrl?.url ?? '(none)')
const { docs } = await payload.find({ collection: 'aircraft', depth: 1, limit: 5, pagination: false })
for (const a of docs as any[]) {
  console.log(`aircraft ${a.slug.padEnd(20)} hero=${a.heroVideoUrl?.url ?? '-'} vertical=${a.verticalVideo?.url?.url ?? '-'}`)
}
const g = await payload.find({ collection: 'gallery-items', where: { kind: { equals: 'video' } }, depth: 1, limit: 3, pagination: false })
console.log('gallery films    :', (await payload.count({ collection: 'gallery-items', where: { kind: { equals: 'video' } } })).totalDocs)
