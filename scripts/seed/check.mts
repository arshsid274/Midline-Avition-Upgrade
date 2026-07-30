import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

const payload = await getPayload({ config })
const media = await payload.find({ collection: 'media', limit: 100, pagination: false })
const acc = await payload.find({ collection: 'accreditations', limit: 100, pagination: false, sort: 'order' })
console.log('MEDIA:', media.docs.length)
for (const m of media.docs) console.log(`   ${m.filename}  <- ${m.sourcePath}  (${m.width}x${m.height})`)
console.log('ACCREDITATIONS:', acc.docs.length)
for (const a of acc.docs) console.log(`   [${a.enabled ? 'x' : ' '}] ${a.key.padEnd(24)} ${a.kind.padEnd(11)} logo=${typeof a.logo === 'object' ? a.logo.filename : a.logo}`)
