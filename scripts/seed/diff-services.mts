/**
 * Compares every service field in the database against the constant it was
 * seeded from, and exits non-zero on any mismatch.
 *
 *   npx payload run scripts/seed/diff-services.mts
 *
 * This is the gate. Run it before wiring any field into a component.
 *
 * Why it exists: these constants are both the seed source and the render
 * fallback, and until a field is threaded through, the page renders hardcoded
 * JSX that the CMS cannot influence. So three values can drift apart — what the
 * page shows, what the constant says, and what the database holds. An audit of
 * production found exactly that on three headlines, e.g. the sales page showing
 * "Aircraft Sales & Acquisition" while the database held "Buy and sell with
 * confidence".
 *
 * Wiring a field in that state does not error. It does not fail the build. It
 * silently republishes different copy on a live marketing site, and the first
 * person to notice is the client. This script makes that impossible to do by
 * accident.
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config.js'
import {
  SERVICE_CHIPS,
  SERVICE_CLOSINGS,
  SERVICE_FEATURES,
  SERVICE_HEROES,
  SERVICE_INTROS,
  SERVICE_SHOWCASES,
  SERVICE_STANDARDS,
  type ServiceSlug,
} from '../../src/lib/service-content.js'

type Row = { field: string; expected: string; actual: string }

const norm = (v: unknown) => (v == null ? '' : String(v)).trim()

const payload = await getPayload({ config })

let mismatches = 0
let checked = 0

const slugs = Object.keys(SERVICE_HEROES) as ServiceSlug[]

for (const slug of slugs) {
  const g = (await payload.findGlobal({ slug: slug as any, depth: 1 })) as Record<string, any>
  const rows: Row[] = []

  const cmp = (field: string, expected: unknown, actual: unknown) => {
    checked++
    if (norm(expected) !== norm(actual)) {
      rows.push({ field, expected: norm(expected), actual: norm(actual) })
    }
  }

  // ── hero
  const hero = SERVICE_HEROES[slug]
  const h = g?.hero ?? {}
  cmp('hero.eyebrow', hero.eyebrow, h.eyebrow)
  cmp('hero.heading', hero.heading, h.heading)
  cmp('hero.headingAccent', hero.headingAccent ?? '', h.headingAccent)
  cmp('hero.headingRest', hero.headingRest ?? '', h.headingRest)
  cmp('hero.body', hero.body, h.body)
  if (hero.bodySecondary) cmp('hero.bodySecondary', hero.bodySecondary, h.bodySecondary)
  if (hero.footnote) cmp('hero.footnote', hero.footnote, h.footnote)
  // Compare the image by the path it was imported from, not by URL — the URL is
  // whatever the storage adapter currently generates and would differ per host.
  cmp('hero.image', hero.image.src, h.image?.sourcePath)
  cmp('hero.image.alt', hero.image.alt, h.image?.alt)
  if (hero.primary) {
    cmp('hero.primary.label', hero.primary.label, h.primary?.label)
    cmp('hero.primary.href', hero.primary.href, h.primary?.href)
  }
  if (hero.secondary) {
    cmp('hero.secondary.label', hero.secondary.label, h.secondary?.label)
    cmp('hero.secondary.href', hero.secondary.href, h.secondary?.href)
  }
  ;(hero.stats ?? []).forEach((s, i) => {
    cmp(`hero.stats[${i}].value`, s.value, h.stats?.[i]?.value)
    cmp(`hero.stats[${i}].label`, s.label, h.stats?.[i]?.label)
  })

  // ── standards
  const st = SERVICE_STANDARDS[slug]
  if (st) {
    const d = g?.standards ?? {}
    cmp('standards.eyebrow', st.eyebrow, d.eyebrow)
    cmp('standards.heading', st.heading, d.heading)
    cmp('standards.headingAccent', st.headingAccent ?? '', d.headingAccent)
    cmp('standards.intro', st.intro, d.intro)
    cmp('standards.figureValue', st.figureValue, d.figureValue)
    cmp('standards.figureLabel', st.figureLabel, d.figureLabel)
    cmp('standards.image', st.image.src, d.image?.sourcePath)
    st.cards.forEach((c, i) => {
      cmp(`standards.cards[${i}].title`, c.title, d.cards?.[i]?.title)
      cmp(`standards.cards[${i}].description`, c.description ?? '', d.cards?.[i]?.description)
      cmp(`standards.cards[${i}].icon`, c.icon ?? '', d.cards?.[i]?.icon)
    })
  }

  // ── intro
  const intro = SERVICE_INTROS[slug]
  if (intro) {
    const d = g?.intro ?? {}
    cmp('intro.eyebrow', intro.eyebrow, d.eyebrow)
    cmp('intro.heading', intro.heading, d.heading)
    intro.paragraphs.forEach((p, i) => cmp(`intro.paragraphs[${i}]`, p, d.paragraphs?.[i]?.text))
  }

  // ── features
  const f = SERVICE_FEATURES[slug]
  if (f) {
    const d = g?.features ?? {}
    cmp('features.eyebrow', f.eyebrow ?? '', d.eyebrow)
    cmp('features.heading', f.heading, d.heading)
    cmp('features.intro', f.intro ?? '', d.intro)
    f.cards.forEach((c, i) => {
      cmp(`features.cards[${i}].title`, c.title, d.cards?.[i]?.title)
      cmp(`features.cards[${i}].description`, c.description ?? '', d.cards?.[i]?.description)
      cmp(`features.cards[${i}].icon`, c.icon ?? '', d.cards?.[i]?.icon)
      ;(c.points ?? []).forEach((p, j) =>
        cmp(`features.cards[${i}].points[${j}]`, p, d.cards?.[i]?.points?.[j]?.text)
      )
    })
  }

  // ── showcase
  const sh = SERVICE_SHOWCASES[slug]
  if (sh) {
    const d = g?.showcase ?? {}
    cmp('showcase.eyebrow', sh.eyebrow ?? '', d.eyebrow)
    cmp('showcase.heading', sh.heading, d.heading)
    cmp('showcase.intro', sh.intro ?? '', d.intro)
    sh.cards.forEach((c, i) => {
      cmp(`showcase.cards[${i}].title`, c.title, d.cards?.[i]?.title)
      cmp(`showcase.cards[${i}].description`, c.description ?? '', d.cards?.[i]?.description)
      cmp(`showcase.cards[${i}].image`, c.image.src, d.cards?.[i]?.image?.sourcePath)
      cmp(`showcase.cards[${i}].badge`, c.badge ?? '', d.cards?.[i]?.badge)
    })
    ;(sh.stats ?? []).forEach((s, i) => {
      cmp(`showcase.stats[${i}].value`, s.value, d.stats?.[i]?.value)
      cmp(`showcase.stats[${i}].label`, s.label, d.stats?.[i]?.label)
    })
  }

  // ── services chips
  const ch = SERVICE_CHIPS[slug]
  if (ch) {
    const d = g?.services ?? {}
    cmp('services.eyebrow', ch.eyebrow, d.eyebrow)
    cmp('services.heading', ch.heading, d.heading)
    cmp('services.intro', ch.intro, d.intro)
    ch.chips.forEach((c, i) => cmp(`services.chips[${i}].label`, c.label, d.chips?.[i]?.label))
  }

  // ── closing
  const cl = SERVICE_CLOSINGS[slug]
  if (cl) {
    const d = g?.closing ?? {}
    cmp('closing.eyebrow', cl.eyebrow, d.eyebrow)
    cmp('closing.heading', cl.heading, d.heading)
    cmp('closing.body', cl.body, d.body)
    if (cl.cta) {
      cmp('closing.cta.label', cl.cta.label, d.cta?.label)
      cmp('closing.cta.href', cl.cta.href, d.cta?.href)
    }
  }

  if (rows.length === 0) {
    console.log(`  ✓ ${slug}`)
  } else {
    mismatches += rows.length
    console.log(`  ✗ ${slug} — ${rows.length} mismatch(es)`)
    for (const r of rows) {
      console.log(`      ${r.field}`)
      console.log(`        code: ${JSON.stringify(r.expected).slice(0, 110)}`)
      console.log(`        db:   ${JSON.stringify(r.actual).slice(0, 110)}`)
    }
  }
}

console.log(`\n  ${checked} fields checked, ${mismatches} mismatch(es)`)
if (mismatches > 0) {
  console.error(
    '\n  REFUSING: the database and the code fallbacks disagree.\n' +
      '  Wiring a field in this state silently republishes different copy.\n' +
      '  Re-seed (npx payload run scripts/seed/service-pages.mts --force) or fix the constants.'
  )
  process.exit(1)
}
console.log('  Safe to wire: database matches the code fallbacks exactly.')
