/**
 * Provisions a fresh host — schema, content, and every photo and film.
 *
 *   npm run provision
 *
 * Run this ONCE against the production database and bucket, from your machine,
 * before the first deploy. It is not part of the Vercel build: uploading 83 MB
 * through a build step is slow, repeats on every deploy, and would fail the
 * build if the bucket hiccuped.
 *
 * Everything it needs is in the repository. The seeds read their images and
 * films from public/assets/**, which is committed — 128 images and 41 films,
 * all verified present. So this rebuilds the entire media library from source
 * rather than depending on the local media/ and videos/ folders, which are
 * gitignored and exist only on the machine that created them.
 *
 * Required environment (see .env.example):
 *   DATABASE_URI, DATABASE_AUTH_TOKEN   the target database
 *   R2_BUCKET, R2_ENDPOINT,             the target bucket; without these the
 *   R2_ACCESS_KEY_ID,                   files would be written to local disk,
 *   R2_SECRET_ACCESS_KEY                which a serverless host cannot read
 *
 * Safe to re-run. Media and films dedupe on sourcePath, collections match on
 * their own stable keys, and page content is only written where still empty.
 */
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

/**
 * This runs under plain Node rather than `payload run`, so nothing has loaded
 * .env yet. Read it here, but never override a variable already present —
 * that way pointing at production is just:
 *
 *   DATABASE_URI=libsql://... R2_BUCKET=... npm run provision
 *
 * and the local .env cannot silently win and seed the wrong database.
 */
if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
    if (!match) continue
    const [, key, raw] = match
    if (process.env[key]) continue
    const value = raw.trim().replace(/^["']|["']$/g, '')
    if (value) process.env[key] = value
  }
}

const REQUIRED = ['DATABASE_URI', 'PAYLOAD_SECRET']
const R2 = ['R2_BUCKET', 'R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY']

const missing = REQUIRED.filter((key) => !process.env[key])
if (missing.length) {
  console.error(`Missing required environment: ${missing.join(', ')}`)
  process.exit(1)
}

const usingR2 = R2.every((key) => process.env[key])
const usingUploadthing = Boolean(process.env.UPLOADTHING_TOKEN)
// UploadThing wins when both are set, matching the precedence in payload.config.ts.
const storage = usingUploadthing
  ? 'UploadThing'
  : usingR2
    ? `R2 bucket ${process.env.R2_BUCKET}`
    : 'local disk'
const isRemoteDb = (process.env.DATABASE_URI ?? '').startsWith('libsql://')

/**
 * Force NODE_ENV=production for a remote database, so Drizzle's schema `push`
 * stays off — payload.config.ts gates it on exactly this.
 *
 * Without it, every `payload run` below calls getPayload(), which on a dev
 * NODE_ENV runs pushDevSchema against whatever DATABASE_URI points at. That is
 * the correct behaviour locally and a serious one remotely: push rebuilds
 * tables in place (SQLite cannot ALTER a column, so it creates __new_x, copies,
 * drops, renames). A rebuild that fails halfway leaves an orphaned __new_ table
 * and a batch -1 "dev" row in payload_migrations, and that row makes the next
 * `payload migrate` stop and ask whether to risk data loss — which, on a
 * non-interactive stdin, silently answers no and skips migrations entirely.
 *
 * Migrations are the only thing that should ever alter a remote schema.
 */
if (isRemoteDb && process.env.NODE_ENV !== 'production') {
  // NODE_ENV is typed readonly, but this must be set before any child process
  // spawns — they inherit it, and it is what keeps `push` off in their configs.
  ;(process.env as Record<string, string | undefined>).NODE_ENV = 'production'
  console.log('NODE_ENV  : forced to production (schema push disabled for a remote database)')
}

console.log(`Database : ${isRemoteDb ? 'remote (Turso)' : 'local file'}`)
console.log(`Storage  : ${storage}`)

if (isRemoteDb && !usingR2 && !usingUploadthing) {
  console.error(
    '\nRefusing to continue: the database is remote but storage is local.\n' +
      'Files would be written to this machine while the database records URLs a\n' +
      'serverless host cannot serve — every image and film would 404 in production.\n' +
      'Set UPLOADTHING_TOKEN or the four R2_* variables, or point DATABASE_URI\n' +
      'at a local file.'
  )
  process.exit(1)
}

const SEEDS = [
  'videos',
  'accreditations',
  'home-page',
  'contact-page',
  'safety-page',
  'faq-page',
  'about-page',
  'service-pages',
  'gallery',
  'aircraft',
  'fleet-page',
  'legal-pages',
]

console.log('\n── Applying schema ──')
execSync('npx payload migrate', { stdio: 'inherit' })

for (const seed of SEEDS) {
  console.log(`\n── ${seed} ──`)
  execSync(`npx payload run scripts/seed/${seed}.mts`, { stdio: 'inherit' })
}

console.log('\n── Verifying ──')
execSync('npx payload run scripts/seed/verify-sources.mts', { stdio: 'inherit' })

console.log('\nProvisioned. Create your admin account at /admin before sharing the URL.')
