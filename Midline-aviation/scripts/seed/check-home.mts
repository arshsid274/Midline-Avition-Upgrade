import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

const payload = await getPayload({ config })
const g = (await payload.findGlobal({ slug: 'home-page', depth: 1 })) as any
console.log('_status:', g._status)
console.log('hero.eyebrow   :', g.hero?.eyebrow)
console.log('hero.heading   :', `${g.hero?.heading?.line1} | ${g.hero?.heading?.accent} | ${g.hero?.heading?.rest}`)
console.log('hero.cta       :', `${g.hero?.cta?.label} -> ${g.hero?.cta?.href}`)
console.log('hero.videoUrl  :', g.hero?.videoUrl)
console.log('hero.poster    :', g.hero?.poster?.url, '| alt:', g.hero?.poster?.alt)
console.log('cta.heading    :', g.ctaBanner?.heading)
console.log('cta.primary    :', `${g.ctaBanner?.primary?.label} -> ${g.ctaBanner?.primary?.href}`)
console.log('cta.secondary  :', `${g.ctaBanner?.secondary?.label} -> ${g.ctaBanner?.secondary?.href}`)
