import path from 'path'
import { fileURLToPath } from 'url'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from '@/collections/Media'
import { Users } from '@/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  /**
   * Payload defaults its REST API to /api, which this site already uses for
   * /api/booking, /api/chat, /api/inquiry and /api/airports/suggest. Moving
   * Payload to its own prefix keeps those handlers untouchable. The folder
   * src/app/(payload)/payload-api must match this value.
   */
  routes: {
    api: '/payload-api',
  },

  collections: [Users, Media],

  /**
   * SQLite: a single file, no database server, no monthly cost. It lives at
   * <repo>/data/midline.db — a sibling of public/, so it is never web-served.
   * On a VPS, override DATABASE_URI to a path outside the deploy directory
   * (e.g. file:/var/lib/midline/cms.db) so releases cannot clobber it.
   */
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./data/midline.db',
    },
  }),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Generates the admin thumbnail and reads real image dimensions on upload.
  sharp,

  plugins: [
    /**
     * Files go to Cloudflare R2 via its S3-compatible API.
     *
     * NOT @payloadcms/storage-r2 — that adapter takes a Cloudflare Workers
     * R2Bucket *binding* rather than credentials, so it only works when the app
     * itself runs on Workers. The S3 adapter is Payload's documented approach
     * for Node hosts and is what keeps this deployable anywhere.
     */
    s3Storage({
      enabled: Boolean(process.env.R2_BUCKET),
      collections: {
        [Media.slug]: { prefix: 'media' },
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        endpoint: process.env.R2_ENDPOINT || '',
        region: 'auto',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
