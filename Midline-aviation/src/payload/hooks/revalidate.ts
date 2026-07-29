import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * On-demand ISR: a CMS edit is worthless if the statically rendered page never
 * changes. These hooks fire after a save and invalidate the affected routes.
 *
 * `revalidatePath` throws outside a Next request context, and the seed scripts
 * run through the Payload CLI — hence the NEXT_RUNTIME guard. Without it,
 * seeding crashes on the first document it writes.
 *
 * We use revalidatePath rather than revalidateTag on purpose: Payload's Local
 * API is direct database access, not `fetch`, so it is neither fetch-tagged nor
 * wrapped in unstable_cache and tags would never reach it.
 */
const safeRevalidate = (paths: string[]) => {
  if (!process.env.NEXT_RUNTIME) return
  for (const path of paths) revalidatePath(path)
}

/** Build an afterChange/afterDelete hook that invalidates a fixed set of routes. */
export const revalidatePaths =
  (paths: string[]): CollectionAfterChangeHook & CollectionAfterDeleteHook =>
  ({ doc }: { doc: unknown }) => {
    safeRevalidate(paths)
    return doc
  }

/** Same, but the routes depend on the document (e.g. an aircraft's own slug). */
export const revalidatePathsFor =
  (build: (doc: Record<string, unknown>) => string[]): CollectionAfterChangeHook &
    CollectionAfterDeleteHook =>
  ({ doc }: { doc: Record<string, unknown> }) => {
    safeRevalidate(build(doc))
    return doc
  }

/** A media file can appear on any page — invalidate the entire layout tree. */
export const revalidateEverywhere: CollectionAfterChangeHook & CollectionAfterDeleteHook = ({
  doc,
}: {
  doc: unknown
}) => {
  if (process.env.NEXT_RUNTIME) revalidatePath('/', 'layout')
  return doc
}

/** Globals hand back `doc` too, but their hook type differs from collections'. */
export const revalidateGlobal =
  (paths: string[]): GlobalAfterChangeHook =>
  ({ doc }) => {
    safeRevalidate(paths)
    return doc
  }
