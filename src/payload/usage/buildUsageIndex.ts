import { cache } from 'react'

import type { Payload } from 'payload'

/**
 * A reverse index answering "where on the site is this photo or film used?",
 * shown on every Media and Videos document so an editor can see what they are
 * about to replace — and follow the link to the page that uses it.
 *
 * Built by walking every global and every content collection at depth 1 and
 * recording each populated upload document encountered. Depth 1 matters: it is
 * what turns a bare foreign key into an object carrying `filename` and
 * `mimeType`, which is how an upload is recognised without hard-coding the
 * name of every image field in the project. New upload fields are picked up
 * automatically.
 *
 * Scope is the published version of each document, because that is what the
 * question means: an asset referenced only by an unsaved draft is not yet "in
 * use" anywhere a visitor can see.
 */

export type UsageLocation = {
  /** Human-readable place, e.g. "Home Page → Destinations → Cards #2 → Image". */
  label: string
  /** Admin URL of the document using the asset. */
  href: string
}

/** Keyed `media:12` / `videos:3`. */
export type UsageIndex = Map<string, UsageLocation[]>

/**
 * A populated upload relationship. `mimeType` + `filename` together only occur
 * on upload docs, and `mimeType` also tells the two upload collections apart —
 * a populated doc does not name the collection it came from.
 */
const asUploadDoc = (
  value: Record<string, unknown>
): { collection: 'media' | 'videos'; id: number | string } | null => {
  if (typeof value.filename !== 'string' || typeof value.mimeType !== 'string') return null
  const id = value.id
  if (typeof id !== 'number' && typeof id !== 'string') return null
  return { collection: value.mimeType.startsWith('video/') ? 'videos' : 'media', id }
}

/** Internal bookkeeping that would only add noise to a location label. */
const SKIP_KEYS = new Set(['id', 'createdAt', 'updatedAt', 'globalType', 'blockType'])

const walk = (
  value: unknown,
  path: string[],
  onHit: (hit: { collection: 'media' | 'videos'; id: number | string }, path: string[]) => void
): void => {
  if (Array.isArray(value)) {
    // 1-based: editors count rows from one, and so do the admin's row labels.
    value.forEach((item, index) => walk(item, [...path, `#${index + 1}`], onHit))
    return
  }
  if (!value || typeof value !== 'object') return

  const record = value as Record<string, unknown>
  const upload = asUploadDoc(record)
  if (upload) {
    // Do not recurse into the upload doc itself — its `sizes` object contains
    // nested filename/mimeType pairs that would double-count the same file.
    onHit(upload, path)
    return
  }

  for (const [key, child] of Object.entries(record)) {
    if (SKIP_KEYS.has(key) || key.startsWith('_')) continue
    walk(child, [...path, key], onHit)
  }
}

/** camelCase field name → words an editor recognises: jetVisuals → "Jet visuals". */
const prettify = (segment: string): string => {
  const spaced = segment.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

/** Join path segments, folding "#n" indexes into the segment before them. */
const joinPath = (segments: string[]): string =>
  segments
    .reduce<string[]>((out, segment) => {
      if (segment.startsWith('#') && out.length > 0) {
        out[out.length - 1] = `${out[out.length - 1]} ${segment}`
      } else {
        out.push(prettify(segment))
      }
      return out
    }, [])
    .join(' → ')

const labelToString = (label: unknown, fallback: string): string =>
  typeof label === 'string' ? label : fallback

/** 'home-page' → 'Home Page'. */
const titleCaseSlug = (slug: string): string =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

/**
 * Builds the full index in one pass. Wrapped in React's cache() so that when
 * the list view renders a "Used on" cell for every visible row, the scan runs
 * once per request rather than once per row.
 */
export const getUsageIndex = cache(async (payload: Payload): Promise<UsageIndex> => {
  const index: UsageIndex = new Map()
  const adminRoute = payload.config.routes.admin

  const record = (
    hit: { collection: 'media' | 'videos'; id: number | string },
    location: UsageLocation
  ) => {
    const key = `${hit.collection}:${hit.id}`
    const existing = index.get(key) ?? []
    // The same asset can legitimately appear twice in one document (two cards
    // sharing a photo) — only exact duplicate locations are dropped.
    if (!existing.some((l) => l.label === location.label && l.href === location.href)) {
      existing.push(location)
      index.set(key, existing)
    }
  }

  // ── Globals: the page documents ────────────────────────────────────────────
  for (const global of payload.config.globals) {
    const doc = await payload.findGlobal({ slug: global.slug, depth: 1, draft: false })
    const globalLabel = labelToString(global.label, titleCaseSlug(global.slug))
    walk(doc, [], (hit, path) => {
      record(hit, {
        label: [globalLabel, joinPath(path)].filter(Boolean).join(' → '),
        href: `${adminRoute}/globals/${global.slug}`,
      })
    })
  }

  // ── Collections that reference uploads ─────────────────────────────────────
  // The upload collections themselves are the things being indexed, and users
  // reference nothing.
  const skip = new Set(['media', 'videos', 'users'])
  for (const collection of payload.config.collections) {
    if (skip.has(collection.slug)) continue

    const { docs } = await payload.find({
      collection: collection.slug,
      depth: 1,
      limit: 500,
      pagination: false,
    })

    const singular = labelToString(collection.labels?.singular, titleCaseSlug(collection.slug))
    const titleField = collection.admin?.useAsTitle

    for (const doc of docs) {
      const record_ = doc as unknown as Record<string, unknown>
      const title =
        titleField && typeof record_[titleField] === 'string'
          ? (record_[titleField] as string)
          : `#${record_.id}`

      walk(doc, [], (hit, path) => {
        record(hit, {
          label: [`${singular}: ${title}`, joinPath(path)].filter(Boolean).join(' → '),
          href: `${adminRoute}/collections/${collection.slug}/${record_.id}`,
        })
      })
    }
  }

  return index
})

/** Locations for one asset, most convenient signature for the components. */
export const getUsageFor = async (
  payload: Payload,
  collection: 'media' | 'videos',
  id: number | string
): Promise<UsageLocation[]> => {
  const index = await getUsageIndex(payload)
  return index.get(`${collection}:${id}`) ?? []
}
