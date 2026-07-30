/**
 * Runs `payload migrate`, but only when the database is actually configured.
 *
 * Why this exists: the build command is `npm run migrate && npm run build`.
 * On a host with no environment variables set, `payload migrate` throws
 * "missing secret key" and the whole deployment fails — so you get no site at
 * all, rather than a site you can look at. That is the wrong trade for a
 * review deploy, where the most useful outcome is a URL that renders.
 *
 * Every CMS mapper falls back to the committed content in src/lib/*-content.ts,
 * so a build without a database still produces the complete, correct site — it
 * just is not editable. Skipping loudly gets you that; failing gets you a 404.
 *
 * This never silently hides a misconfiguration: it prints exactly what is
 * missing and what the consequence is.
 */
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

// Plain Node does not read .env the way `payload migrate` does, so load it here
// for local runs. Never override a variable already present — on a host the
// injected environment must win.
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

const secret = process.env.PAYLOAD_SECRET
const database = process.env.DATABASE_URI

const missing = [
  !secret && 'PAYLOAD_SECRET',
  !database && 'DATABASE_URI',
].filter(Boolean)

if (missing.length > 0) {
  console.warn('')
  console.warn('  ⚠  Skipping database migrations.')
  console.warn(`     Not set: ${missing.join(', ')}`)
  console.warn('')
  console.warn('     The site will build and render correctly using its')
  console.warn('     built-in content, but the CMS will not work:')
  console.warn('       · /admin will fail to load')
  console.warn('       · edits will not appear on the site')
  console.warn('')
  console.warn('     Set these in your host\'s environment variables — a local')
  console.warn('     .env file is not deployed. See .env.example.')
  console.warn('')
  process.exit(0)
}

// A file-backed database on a serverless host is almost always a mistake: the
// filesystem is read-only at runtime and per-invocation, so the schema created
// here during the build is not the one the deployed app talks to.
if (database.startsWith('file:') && process.env.VERCEL) {
  console.warn('')
  console.warn('  ⚠  DATABASE_URI points at a file, but this is a serverless host.')
  console.warn('     Migrations would apply to a throwaway build container.')
  console.warn('     Use a hosted database (libsql://...) instead.')
  console.warn('')
  process.exit(0)
}

console.log(`  Running migrations against ${database.split('?')[0]}`)
execSync('payload migrate', { stdio: 'inherit' })
