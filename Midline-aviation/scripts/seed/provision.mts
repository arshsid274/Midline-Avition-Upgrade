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
const isRemoteDb = (process.env.DATABASE_URI ?? '').startsWith('libsql://')

console.log(`Database : ${isRemoteDb ? 'remote (Turso)' : 'local file'}`)
console.log(`Storage  : ${usingR2 ? `R2 bucket ${process.env.R2_BUCKET}` : 'local disk'}`)

if (isRemoteDb && !usingR2) {
  console.error(
    '\nRefusing to continue: the database is remote but storage is local.\n' +
      'Files would be written to this machine while the database records URLs a\n' +
      'serverless host cannot serve — every image and film would 404 in production.\n' +
      'Set the four R2_* variables, or point DATABASE_URI at a local file.'
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
