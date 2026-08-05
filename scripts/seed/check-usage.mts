import { getPayload } from 'payload'

// Relative, not the @/ alias: the Payload CLI transpiles these through tsx,
// which does not read tsconfig paths.
import config from '../../src/payload.config.js'
import { getUsageIndex } from '../../src/payload/usage/buildUsageIndex.js'

/**
 * Exercises the "Used on" index against the real database, printing a sample
 * and coverage numbers — run after changing buildUsageIndex.ts to prove the
 * walker still finds everything.
 */
const payload = await getPayload({ config })
const index = await getUsageIndex(payload)

const media = await payload.count({ collection: 'media' })
const videos = await payload.count({ collection: 'videos' })

let mediaUsed = 0
let videosUsed = 0
let locations = 0
for (const [key, list] of index) {
  if (key.startsWith('media:')) mediaUsed += 1
  else videosUsed += 1
  locations += list.length
}

console.log(`media:  ${mediaUsed}/${media.totalDocs} referenced somewhere`)
console.log(`videos: ${videosUsed}/${videos.totalDocs} referenced somewhere`)
console.log(`total locations: ${locations}`)

console.log('\nSample:')
for (const [key, list] of [...index].slice(0, 8)) {
  console.log(`  ${key}`)
  for (const location of list.slice(0, 2)) console.log(`     ${location.label}  →  ${location.href}`)
}
