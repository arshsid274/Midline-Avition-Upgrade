import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { SAFETY_CONTENT } from '../../src/lib/safety-content.js'

const force = process.argv.includes('--force')

const run = async () => {
  const payload = await getPayload({ config })
  const existing = (await payload.findGlobal({ slug: 'safety-page', depth: 0 })) as Record<string, any>
  if (!force && existing?.hero?.heading) {
    console.log('  = safety already has content, skipped (use --force)')
    return
  }
  await payload.updateGlobal({
    slug: 'safety-page',
    data: { ...SAFETY_CONTENT, _status: 'published' } as any,
    draft: false,
  })
  console.log('  + all 7 safety sections')
  console.log('Done — Safety published.')
}

await run()
