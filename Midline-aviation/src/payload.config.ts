import path from 'path'
import { fileURLToPath } from 'url'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Accreditations } from './collections/Accreditations'
import { Aircraft } from './collections/Aircraft'
import { GalleryItems } from './collections/GalleryItems'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { AboutPage } from './globals/AboutPage'
import { ContactPage } from './globals/ContactPage'
import { FaqPage } from './globals/FaqPage'
import { HomePage } from './globals/HomePage'
import { SafetyPage } from './globals/SafetyPage'
import {
  CargoPage,
  CharterPage,
  ManagementPage,
  MroPage,
  SalesPage,
} from './globals/servicePages'

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

  // Order matters: nav groups render in the order their entities appear, so
  // "Pages" (the globals) must be listed before the library collections for
  // the sidebar to read the way the site does.
  collections: [Aircraft, Accreditations, GalleryItems, Media, Users],
  globals: [
    HomePage,
    AboutPage,
    CharterPage,
    ManagementPage,
    SalesPage,
    CargoPage,
    MroPage,
    ContactPage,
    SafetyPage,
    FaqPage,
  ],

  /**
   * SQLite, via libSQL — the same adapter serves two very different hosts:
   *
   *   local / VPS / cPanel   file:./data/midline.db      (a plain file on disk)
   *   Vercel                 libsql://...  + auth token  (hosted Turso)
   *
   * A file-backed database cannot work on Vercel: the filesystem is read-only
   * and ephemeral, and every serverless invocation gets its own instance, so
   * writes would fail and nothing would be shared. Turso is still SQLite, so
   * moving between the two is a change of environment variables, not schema.
   *
   * On a VPS, point DATABASE_URI outside the deploy directory
   * (e.g. file:/var/lib/midline/cms.db) so releases cannot clobber it.
   */
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./data/midline.db',
      ...(process.env.DATABASE_AUTH_TOKEN
        ? { authToken: process.env.DATABASE_AUTH_TOKEN }
        : {}),
    },
    // Drizzle's schema "push" is development-only. Production deploys must run
    // `payload migrate`, so keep push off whenever NODE_ENV is production.
    push: process.env.NODE_ENV !== 'production',
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
