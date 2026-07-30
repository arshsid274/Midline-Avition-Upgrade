/**
 * Runs every seed in dependency order against a fresh database.
 *
 *   npm run migrate && npm run seed:all
 *
 * Each individual seed is idempotent, so this is also safe to re-run on an
 * existing database — it fills gaps rather than overwriting edited content.
 */
import { execSync } from 'node:child_process'

const SEEDS = [
  'accreditations',
  'home-page',
  'contact-page',
  'safety-page',
  'faq-page',
  'about-page',
  'service-pages',
  'gallery',
  'aircraft',
]

for (const seed of SEEDS) {
  console.log(`\n──── ${seed} ────`)
  execSync(`npx payload run scripts/seed/${seed}.mts`, { stdio: 'inherit' })
}
console.log('\nAll seeds complete.')
