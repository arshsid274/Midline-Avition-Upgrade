import path from 'path'

import { getPayload } from 'payload'

// Relative, not the @/ and @payload-config aliases: the Payload CLI transpiles
// these scripts through tsx's CJS loader, which does not read tsconfig paths.
import config from '../../src/payload.config.js'

import { PUBLIC_DIR } from './lib/media.mjs'

/**
 * Replaces the file on each accreditation's Media doc with the current contents
 * of public/assets/images/accreditations.
 *
 * scripts/seed/accreditations.mts cannot do this: importMedia is idempotent on
 * `sourcePath`, so once a logo is imported a re-run returns the existing doc and
 * never re-uploads. That is the right behaviour for seeding, but it means edits
 * to a source file never reach the CMS. This script exists for exactly that
 * case — run it after scripts/normalize-accreditation-logos.mjs.
 *
 * Run with:
 *
 *   npx payload run scripts/seed/reimport-accreditation-logos.mts
 *
 * Payload re-derives width, height, filesize and the thumbnail from the new
 * file, and the collection's afterChange hook revalidates the affected pages.
 */
const run = async () => {
  const payload = await getPayload({ config })

  const accreditations = await payload.find({
    collection: 'accreditations',
    depth: 1,
    limit: 100,
    pagination: false,
    sort: 'order',
  })

  console.log(`Re-uploading logos for ${accreditations.docs.length} accreditations...`)

  for (const doc of accreditations.docs) {
    const logo = doc.logo

    if (!logo || typeof logo !== 'object') {
      console.log(`  ! ${doc.key} — logo not resolved, skipped`)
      continue
    }

    const { sourcePath } = logo

    if (!sourcePath) {
      console.log(`  ! ${doc.key} — media has no sourcePath, skipped`)
      continue
    }

    const updated = await payload.update({
      collection: 'media',
      id: logo.id,
      data: {},
      filePath: path.join(PUBLIC_DIR, sourcePath.replace(/^\//, '')),
    })

    console.log(
      `  ~ ${doc.key.padEnd(24)} ${logo.width}x${logo.height} -> ${updated.width}x${updated.height}`
    )
  }

  console.log('Done.')
}

// Top-level await, not run().catch(): the runner does not wait on a dangling
// promise, so a floating call exits before a single row is written.
await run()
