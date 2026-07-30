import path from 'path'
import { fileURLToPath } from 'url'

import type { Payload } from 'payload'

const filename = fileURLToPath(import.meta.url)
export const REPO_ROOT = path.resolve(path.dirname(filename), '../../..')
export const PUBLIC_DIR = path.join(REPO_ROOT, 'public')

/**
 * Import one file from public/ into the Media collection.
 *
 * Idempotent by `sourcePath`, which carries the original /assets/... path and is
 * unique in the schema. Re-running a seed therefore creates nothing and is safe
 * — that is what lets surfaces be migrated one at a time without a full reset.
 *
 * Returns the media document ID either way.
 */
export const importMedia = async (
  payload: Payload,
  sourcePath: string,
  alt: string
): Promise<number> => {
  const existing = await payload.find({
    collection: 'media',
    where: { sourcePath: { equals: sourcePath } },
    limit: 1,
    pagination: false,
  })

  if (existing.docs.length > 0) {
    const doc = existing.docs[0]
    console.log(`  = exists  ${sourcePath}`)
    return doc.id as number
  }

  const created = await payload.create({
    collection: 'media',
    data: { alt, sourcePath },
    filePath: path.join(PUBLIC_DIR, sourcePath.replace(/^\//, '')),
  })

  console.log(`  + created ${sourcePath}`)
  // SQLite issues integer primary keys; the generated types expect a number.
  return created.id as number
}
