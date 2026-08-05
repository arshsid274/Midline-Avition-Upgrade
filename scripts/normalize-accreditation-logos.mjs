import { readdir } from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'

/**
 * Normalises the accreditation logos so every mark reads at the same optical
 * size in the home-page marquee.
 *
 * The marquee draws each logo with `object-contain` inside a fixed 195x64 box,
 * which fits the image *canvas* — not the mark inside it. The source files were
 * exported with wildly different amounts of baked-in transparent padding (NBAA's
 * mark covered 8% of its canvas, AOPA's 96%), so identical tiles rendered marks
 * at wildly different sizes: NBAA came out 52x11px and effectively invisible
 * next to AOPA at 98x63px.
 *
 * Two passes fix that:
 *   1. trim the transparent padding, so the canvas *is* the mark and
 *      object-contain finally measures the thing it is supposed to measure;
 *   2. resize onto a 2x-DPR target box, because several marks are small enough
 *      that filling the render box would otherwise upscale them in the browser.
 *
 * Run with: node scripts/normalize-accreditation-logos.mjs [--dry]
 *
 * Idempotent: a second run finds nothing left to trim and re-encodes to the same
 * dimensions. The originals are in git, so `git checkout` reverts a bad run.
 */

const LOGO_DIR = 'public/assets/images/accreditations'

/**
 * The marquee renders each mark into a 195x64 CSS box. Targeting twice that
 * keeps a 2x display sharp; `fit: 'inside'` preserves aspect ratio, so a wide
 * wordmark ends up 390px wide and a square badge 128px tall — which is how a
 * logo strip is meant to look, rather than every mark forced to one height.
 */
const TARGET = { width: 390, height: 128 }

/** Alpha below this counts as padding. Low enough to keep soft antialiased edges. */
const TRIM_THRESHOLD = 10

const run = async () => {
  const dry = process.argv.includes('--dry')
  const files = (await readdir(LOGO_DIR)).filter((f) => f.endsWith('.webp')).sort()

  if (files.length === 0) {
    console.error(`No .webp files in ${LOGO_DIR}`)
    process.exitCode = 1
    return
  }

  console.log(`${dry ? 'Previewing' : 'Normalising'} ${files.length} accreditation logos\n`)

  for (const file of files) {
    const filePath = path.join(LOGO_DIR, file)
    const before = await sharp(filePath).metadata()

    // toBuffer first: sharp cannot write to the file it is reading from.
    const { data, info } = await sharp(filePath)
      .trim({ threshold: TRIM_THRESHOLD })
      .resize({ ...TARGET, fit: 'inside', withoutEnlargement: false, kernel: 'lanczos3' })
      .webp({ quality: 90, alphaQuality: 100, effort: 6 })
      .toBuffer({ resolveWithObject: true })

    const name = file.replace(/\.webp$/, '').padEnd(26)
    const arrow = `${before.width}x${before.height} -> ${info.width}x${info.height}`
    console.log(`  ${name} ${arrow.padEnd(24)} ${(info.size / 1024).toFixed(1)} KB`)

    if (!dry) await sharp(data).toFile(filePath)
  }

  console.log(
    dry
      ? '\nDry run — nothing written.'
      : '\nDone. Re-import into the CMS with: npx payload run scripts/seed/reimport-accreditation-logos.mts'
  )
}

await run()
