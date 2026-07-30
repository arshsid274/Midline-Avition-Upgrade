import type { CollectionConfig } from 'payload'

import { revalidateEverywhere } from '../payload/hooks/revalidate'

/**
 * Uploadable video files.
 *
 * Videos were originally static files on R2 referenced by a typed path, which
 * meant an editor could re-point a section at an existing clip but could never
 * upload a new one. This collection makes them replaceable from the admin like
 * any other asset.
 *
 * Deliberately separate from Media rather than widening its mimeTypes:
 *
 *  - Media runs sharp and generates an `imageSizes` thumbnail. sharp cannot
 *    process video, so every upload would either fail or need conditional
 *    branching through the whole image pipeline.
 *  - The media library is browsed visually when picking a picture; mixing 50 MB
 *    films into that grid makes both harder to use.
 *  - Different size expectations: images here are ~90 KB, films are tens of MB.
 *
 * Note on hosting: Vercel caps a serverless request body at 4.5 MB, so large
 * uploads must go straight from the browser to R2. `clientUploads` in the
 * storage plugin does that; without it anything past a few MB fails on deploy
 * while working fine locally.
 */
export const Videos: CollectionConfig = {
  slug: 'videos',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Media',
    useAsTitle: 'title',
    defaultColumns: ['title', 'filename', 'filesize'],
    description:
      'Films used in page headers, aircraft pages and the gallery. Upload a new file over an existing entry to replace it everywhere it appears.',
  },
  upload: {
    mimeTypes: ['video/*'],
    // No imageSizes: sharp does not process video, and a film needs no
    // derivatives — the browser streams the original.
    disableLocalStorage: false,
  },
  hooks: {
    // A film can appear on any page, so invalidate the whole tree.
    afterChange: [revalidateEverywhere],
    afterDelete: [revalidateEverywhere],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'How this film is listed when choosing one, e.g. "G200 showcase reel".' },
    },
    {
      name: 'sourcePath',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description:
          'Original /assets path this film was imported from. Set by the seed script and used to keep re-runs idempotent — do not edit.',
      },
    },
  ],
}
