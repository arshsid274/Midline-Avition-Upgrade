import type { CollectionConfig } from 'payload'

import { revalidateEverywhere } from '../payload/hooks/revalidate'

/**
 * Every image on the site. Files live on Cloudflare R2 (see the s3Storage
 * plugin in payload.config.ts); this collection holds the metadata.
 *
 * Two deliberate choices:
 *
 * 1. `read` is public. Payload's default access is authenticated-only for ALL
 *    operations including read, which would make every image 403 for visitors.
 *    Uploading, replacing and deleting still require a logged-in user, because
 *    those fall through to the restrictive default.
 *
 * 2. Only one `imageSize` is generated, and it is purely the admin grid
 *    thumbnail. next/image already produces responsive AVIF/WebP variants via
 *    deviceSizes/imageSizes in next.config.ts, so generating four Payload sizes
 *    per image would mean ~560 extra R2 objects that Next re-encodes anyway.
 *    `formatOptions`/`resizeOptions` are intentionally unset so originals are
 *    stored byte-for-byte — the existing WebP files are already well optimised
 *    (~87 KB average) and re-encoding them would only lose quality.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'sourcePath'],
  },
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [{ name: 'thumbnail', width: 400, position: 'centre' }],
    adminThumbnail: 'thumbnail',
  },
  hooks: {
    // A Media doc can surface on any page, so invalidate the whole tree.
    afterChange: [revalidateEverywhere],
    afterDelete: [revalidateEverywhere],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describes the image for screen readers and search engines.' },
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
          'Original /assets path this image was imported from. Set by the seed script and used to make re-runs idempotent — do not edit.',
      },
    },
  ],
}
