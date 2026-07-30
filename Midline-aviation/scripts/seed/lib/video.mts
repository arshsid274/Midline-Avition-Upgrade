import path from 'path'
import { fileURLToPath } from 'url'

import type { Payload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const REPO_ROOT = path.resolve(path.dirname(filename), '../../..')
const PUBLIC_DIR = path.join(REPO_ROOT, 'public')

/** Turn "/assets/videos/gallery/g450-maldives.mp4" into "G450 maldives". */
const titleFrom = (sourcePath: string) => {
  const base = sourcePath.split('/').pop()?.replace(/\.[^.]+$/, '') ?? sourcePath
  const words = base.replace(/[-_]+/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/**
 * Import one film from public/ into the Videos collection.
 * Idempotent on `sourcePath`, exactly like importMedia.
 */
export const importVideo = async (
  payload: Payload,
  sourcePath: string,
  title?: string
): Promise<number | null> => {
  if (!sourcePath) return null

  const existing = await payload.find({
    collection: 'videos',
    where: { sourcePath: { equals: sourcePath } },
    limit: 1,
    pagination: false,
  })
  if (existing.docs.length) return existing.docs[0].id as number

  const created = await payload.create({
    collection: 'videos',
    data: { title: title ?? titleFrom(sourcePath), sourcePath },
    filePath: path.join(PUBLIC_DIR, sourcePath.replace(/^\//, '')),
  })
  console.log(`  + ${sourcePath}`)
  return created.id as number
}
