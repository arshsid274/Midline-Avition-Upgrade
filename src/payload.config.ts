import path from 'path'
import { fileURLToPath } from 'url'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { s3Storage } from '@payloadcms/storage-s3'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Accreditations } from './collections/Accreditations'
import { Aircraft } from './collections/Aircraft'
import { GalleryItems } from './collections/GalleryItems'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Videos } from './collections/Videos'
import { AboutPage } from './globals/AboutPage'
import { ContactPage } from './globals/ContactPage'
import { FaqPage } from './globals/FaqPage'
import { FleetPage } from './globals/FleetPage'
import { LegalPages } from './globals/LegalPages'
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
  collections: [Aircraft, Accreditations, GalleryItems, Media, Videos, Users],
  globals: [
    HomePage,
    AboutPage,
    FleetPage,
    CharterPage,
    ManagementPage,
    SalesPage,
    CargoPage,
    MroPage,
    ContactPage,
    SafetyPage,
    FaqPage,
    LegalPages,
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
     * Where uploaded files live. Three supported arrangements, chosen by which
     * environment variables are present — no code change to move between them:
     *
     *   UPLOADTHING_TOKEN set  →  UploadThing   free tier, no card, 2 GB
     *   R2_BUCKET set          →  Cloudflare R2 free tier, card required, 10 GB
     *   neither                →  local disk    cPanel, a VPS, or development
     *
     * The local case is not a fallback, it is the correct answer on any host
     * with a persistent writable filesystem. Object storage is only required
     * because serverless platforms discard their disk between requests — which
     * is also why every free serverless host needs one of the two above.
     *
     * Exactly one adapter is ever active: each is gated on its own variable,
     * and UploadThing is checked first so setting its token wins outright.
     */
    uploadthingStorage({
      enabled: Boolean(process.env.UPLOADTHING_TOKEN),
      collections: {
        // No prefix keys here — UploadThing addresses files by opaque key and
        // does not support path prefixes the way S3 does.
        //
        // disablePayloadAccessControl makes stored URLs point straight at
        // UploadThing's CDN instead of being proxied through Payload's own
        // /payload-api/<collection>/file/<name> route.
        //
        // The proxy is the default and it is the wrong default here. Every
        // request for a file would execute a serverless function that fetches
        // from UploadThing and streams the response back. For images that is
        // merely wasteful — next/image caches optimised output for 30 days, so
        // the function runs rarely. For the 41 films it is a real defect:
        // video playback issues HTTP range requests, and satisfying those from
        // a function means cold starts, a 60-second execution ceiling, and
        // every byte billed as function bandwidth.
        //
        // Nothing is lost by disabling it. These are public marketing assets
        // with `read: () => true` — there is no access control to enforce.
        [Media.slug]: { disablePayloadAccessControl: true },
        [Videos.slug]: { disablePayloadAccessControl: true },
      },
      // Same reason as R2 below: films exceed Vercel's 4.5 MB body cap and must
      // go browser → UploadThing rather than through a serverless function.
      clientUploads: true,
      options: {
        token: process.env.UPLOADTHING_TOKEN || '',
        acl: 'public-read',
      },
    }),

    /**
     * Files go to Cloudflare R2 via its S3-compatible API.
     *
     * NOT @payloadcms/storage-r2 — that adapter takes a Cloudflare Workers
     * R2Bucket *binding* rather than credentials, so it only works when the app
     * itself runs on Workers. The S3 adapter is Payload's documented approach
     * for Node hosts and is what keeps this deployable anywhere.
     */
    s3Storage({
      enabled: Boolean(process.env.R2_BUCKET) && !process.env.UPLOADTHING_TOKEN,
      collections: {
        [Media.slug]: { prefix: 'media' },
        [Videos.slug]: { prefix: 'videos' },
      },
      // Vercel caps a serverless request body at 4.5 MB. Films are tens of MB,
      // so they must go straight from the browser to R2 rather than through a
      // function. Without this, large uploads work locally and fail on deploy.
      clientUploads: true,
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
