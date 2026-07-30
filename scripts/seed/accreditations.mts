import { getPayload } from 'payload'

// Relative, not the @/ and @payload-config aliases: the Payload CLI transpiles
// these scripts through tsx's CJS loader, which does not read tsconfig paths.
import config from '../../src/payload.config.js'
import { ACCREDITATIONS } from '../../src/lib/accreditations.js'

import { importMedia } from './lib/media.mjs'

/**
 * Seeds the Accreditations collection from the legacy src/lib/accreditations.ts
 * array. Run with:
 *
 *   npx payload run scripts/seed/accreditations.ts
 *
 * Alt text is preserved by importing the real module rather than parsing paths —
 * `name` was already doing double duty as alt, so it carries straight over.
 *
 * Safe to re-run: media dedupes on sourcePath and each accreditation is matched
 * on its stable `key`.
 */
const run = async () => {
  const payload = await getPayload({ config })

  console.log(`Seeding ${ACCREDITATIONS.length} accreditations...`)

  for (const [index, accreditation] of ACCREDITATIONS.entries()) {
    const logoId = await importMedia(payload, accreditation.src, accreditation.name)

    const existing = await payload.find({
      collection: 'accreditations',
      where: { key: { equals: accreditation.id } },
      limit: 1,
      pagination: false,
    })

    const data = {
      key: accreditation.id,
      logo: logoId,
      name: accreditation.name,
      shortName: accreditation.shortName,
      kind: accreditation.kind,
      enabled: accreditation.enabled,
      order: index,
    }

    if (existing.docs.length > 0) {
      await payload.update({ collection: 'accreditations', id: existing.docs[0].id, data })
      console.log(`  ~ updated ${accreditation.id}`)
    } else {
      await payload.create({ collection: 'accreditations', data })
      console.log(`  + created ${accreditation.id}`)
    }
  }

  const total = await payload.count({ collection: 'accreditations' })
  const enabled = await payload.count({
    collection: 'accreditations',
    where: { enabled: { equals: true } },
  })
  console.log(`Done. ${total.totalDocs} accreditations, ${enabled.totalDocs} enabled.`)
}

// Top-level await, not run().catch(): the runner does not wait on a dangling
// promise, so a floating call exits before a single row is written.
await run()
