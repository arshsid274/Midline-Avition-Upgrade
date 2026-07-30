import { existsSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

/**
 * Every uploaded file records the /assets path it came from. This checks each
 * one still exists in the repo, because the seeds are what rebuild the library
 * on a fresh host — a missing source means a permanently broken image there.
 */
const payload = await getPayload({ config })
const PUBLIC = path.resolve(process.cwd(), 'public')
let missing = 0

for (const collection of ['media', 'videos'] as const) {
  const { docs } = await payload.find({ collection, limit: 1000, pagination: false, depth: 0 })
  let ok = 0
  for (const doc of docs as any[]) {
    if (!doc.sourcePath) { console.log(`  ? ${collection}: ${doc.filename} has no sourcePath`); continue }
    const onDisk = path.join(PUBLIC, doc.sourcePath.replace(/^\//, ''))
    if (existsSync(onDisk)) ok++
    else { console.log(`  MISSING SOURCE: ${doc.sourcePath}`); missing++ }
  }
  console.log(`${collection}: ${ok}/${docs.length} sources present in repo`)
}
console.log(missing === 0 ? 'All sources present — a fresh host can rebuild the whole library.' : `${missing} missing.`)
