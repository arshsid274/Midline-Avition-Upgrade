import { readdirSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'

import config from '../../src/payload.config.js'
import { importVideo } from './lib/video.mjs'

/**
 * Imports every film in public/assets/videos into the Videos collection so
 * they can be replaced from the admin panel.
 */
const run = async () => {
  const payload = await getPayload({ config })
  const root = path.resolve(process.cwd(), 'public/assets/videos')

  const walk = (dir: string, prefix: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory()
        ? walk(path.join(dir, entry.name), `${prefix}/${entry.name}`)
        : entry.name.endsWith('.mp4')
          ? [`${prefix}/${entry.name}`]
          : []
    )

  const files = walk(root, '/assets/videos').sort()
  for (const file of files) await importVideo(payload, file)

  const total = await payload.count({ collection: 'videos' })
  console.log(`${total.totalDocs} films in the library`)
}

await run()
