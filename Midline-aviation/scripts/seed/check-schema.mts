import config from '../../src/payload.config'

const c = await config
const g = c.globals?.find((x: any) => x.slug === 'home-page') as any
console.log('GLOBAL:', g.slug, '| label:', g.label, '| group:', g.admin?.group)
console.log('drafts:', !!g.versions?.drafts, '| autosave:', JSON.stringify(g.versions?.drafts?.autosave))
const tabs = g.fields[0].tabs
console.log(`TABS (${tabs.length}) — in on-screen order:`)
for (const t of tabs) {
  console.log(`  ${t.label}`)
  for (const f of t.fields) {
    const kind = f.type === 'ui' ? 'note' : f.type
    console.log(`      ${(f.name ?? '(row)').padEnd(18)} ${kind}`)
  }
}
console.log('\nNAV GROUPS:')
for (const col of c.collections ?? []) console.log(`  ${(col.admin?.group ?? '(none)').padEnd(18)} ${col.slug}`)
for (const gl of c.globals ?? []) console.log(`  ${(gl.admin?.group ?? '(none)').padEnd(18)} ${gl.slug}`)
