# Midline Aviation — Client Review Implementation Plan

Source material: `Instruction/MIDLINE AVIATION WEBSITE DEVELOPMENT  COMMENTS.docx` + 6 annotated screenshots.
Status legend: `[x]` done, with a `VERIFIED:` note from the post-implementation pass (grep gate + `npm run build` + rendered-HTML checks on every route + headless-Chrome screenshots of home hero, booking form, fleet hero, MRO, mobile).

## Instruction inventory (Phase 1 — all files ingested)

| File | Page/section shown | Requested change |
|---|---|---|
| ...COMMENTS.docx | Whole site | Full design direction: navy `#0A2632` primary, champagne `#C8A46B` accent, warm off-white neutrals, remove bright blue completely; dark-led hybrid theme; Cinzel/Montserrat rules; hero, booking form, spacing, cards, nav, footer, brand device; AI-photo caution |
| SCR-20260806-szbs.png | Homepage hero | Too many elements: shorter H1 + short subtext; remove eyebrow "Established Excellence", blue "Your Sky." accent, and hero "Book Flight" button (duplicate of nav CTA + booking form) |
| SCR-20260806-szhu.png | Fleet page hero | Cleaner style → use similarly on homepage; H1 too big vs subtext — fix balance; navy overlay over busy video (neutral only as fallback) |
| SCR-20260806-szns.png | Accreditations & Memberships marquee | Remove completely |
| SCR-20260806-szqr.png | "Discover Midline" showcase | No mixed colors in H1s; remove small subtitles ("Elite travel management") — clean heading + body only |
| SCR-20260806-sztt.png | "Our Fleet" cards | Title off the image into text area as heading + body; remove tail-number chips and "Available Now" pills; remove "Fleet" eyebrow; images horizontal 16:9, intact on mobile (no auto-crop) |
| SCR-20260806-szws.png | Card frames | Replace outline/frame boxes with warm off-white solid box (or champagne accent); evaluate against dark mode |

## Decisions taken (approved by Arsh)

- "Request Quote" replaces "Book Flight" on the nav CTA **and** the booking-form submit; hero has no button (screenshot precedence).
- Retheme applies to the **entire site**.
- Booking form = **dark navy card**.
- Fleet card images = **16:9**.

## Checklist

### A. Global color system (docx §1)
- [x] 1. New tokens in `globals.css`: navy `#0A2632`, navy-soft `#113344`, navy-deep `#071B26`, champagne `#C8A46B` (+hover `#B7935A`, deep `#A57F48`), ivory `#F5F1E8`, offwhite `#F1ECE2`, warm canvas `#FAF7F0`, warm hairlines. VERIFIED: tokens present in `@theme`; shadcn vars + `.dark` block + `--midline-*` aliases remapped.
- [x] 2. `--color-ibm-blue` and every alias retired; radii still 0. VERIFIED: no `ibm-blue` token remains in globals.css.
- [x] 3. All ~35 `*-ibm-blue` consumers swept file-by-file (6 parallel agents + manual pass): accents → champagne, buttons → champagne bg + navy label, bands → navy + offwhite. VERIFIED: item 7 gate.
- [x] 4. `BookFlightButton.module.css` blues → champagne (incl. `:active`), label navy, plane icon navy. VERIFIED: no hex blues in file.
- [x] 5. `seo.ts` `BRAND_THEME_COLOR` → `#0A2632`. VERIFIED: theme-color meta emits navy.
- [x] 6. Dead code untouched (MidlineLogoLoader, WorldMap, HomeFooter, RotatingText, app/ui/navigation-menu, ServicePageShell, globe). VERIFIED: only these still contain old hexes; none is imported.
- [x] 7. Gate. VERIFIED: `grep -rn "ibm-blue|0f62fe|0050e6|0043ce|002d9c" src/` returns hits only in the dead files above; every rendered route serves 0 occurrences.
- [x] Bonus in scope of §1: booking/inquiry email templates' blue accent → champagne; DraftBanner → navy/champagne.

### B. Typography (docx §3, §6)
- [x] 8. Body Montserrat 400 (was 300), line-height 1.6; `.midline-copy` scales up to 1.125rem on large screens. VERIFIED: html rule weight 400.
- [x] 9. h1/h2 Cinzel Regular uppercase tracking 0.04em at reduced scale; h3–h6 switched to Montserrat 500. VERIFIED: base rules in globals.css; screenshots show smaller Cinzel headings.
- [x] 10. Buttons Montserrat SemiBold uppercase tracking 0.08em. VERIFIED: global `button` rule + all restyled CTAs.
- [x] 11. `.midline-eyebrow` → Montserrat Medium uppercase, 0.22em tracking. VERIFIED: class updated; services-grid eyebrow uses the style.

### C. Navigation (docx §8)
- [x] 12. Navbar solid `#0A2632`, champagne/25 hairline, off-white Montserrat Medium uppercase links with 0.12em tracking, champagne hover/active, navy dropdown panel. VERIFIED: screenshots (desktop + mobile) show navy bar, champagne active link.
- [x] 13. Logo enlarged (h-10→h-16 across breakpoints) with off-white CSS-filter treatment. VERIFIED: white logo visible on navy in screenshots. *Interim until final logo.*
- [x] 14. Nav CTA → champagne "Request Quote" (same `/#book-your-flight` target). VERIFIED: visible top-right in all screenshots.
- [x] 15. Mobile drawer navy, off-white items, champagne active, champagne-framed Services group. VERIFIED: class changes in MobileMenu.client.tsx.

### D. Homepage hero (szbs, szhu, docx §4)
- [x] 16. Centered layout matching fleet hero. VERIFIED: screenshot — centered H1/subtext.
- [x] 17. Navy overlay `bg-navy/50` replaces black scrim. VERIFIED: screenshot shows navy-tinted footage.
- [x] 18. H1 "Your Sky. Your Schedule." Cinzel off-white single color; accent/rest render untinted (defensive against stale CMS). VERIFIED: dev HTML `<h1>` = new text, no colored span; prod-data build (old copy) also renders single-color.
- [x] 19. Eyebrow removed from render. VERIFIED: "Established Excellence" absent from rendered DOM even with stale CMS data.
- [x] 20. Subtext trimmed to first sentence, `text-base sm:text-lg`. VERIFIED: rendered HTML + screenshot.
- [x] 21. Hero CTA removed; champagne flight-path line in its place. VERIFIED: no booking link inside hero markup; line visible in screenshot.
- [x] 22. SplitHeading/GSAP + `{line1, accent, rest}` structure intact. VERIFIED: prod build settles animation (`translate(0px, 0px)`); heading field schema unchanged (admin copy updated only).

### E. Fleet hero (szhu)
- [x] 23. Navy overlay, H1 one step smaller (3xl→5xl scale), subtext up to `text-base sm:text-lg`, champagne flight-path line. VERIFIED: screenshot — balance fixed, navy overlay legible.

### F. Booking form (docx §5)
- [x] 24. Solid navy card, champagne/25 frame, off-white labels, low-opacity underline fields with hover + champagne focus states, padding up (p-5→p-8), grid gaps up. VERIFIED: screenshot shows navy card w/ champagne toggle. **Follow-up (2026-08-06):** the card no longer overlaps the hero — its section is a solid theme-cream (`bg-ivory`) band so no video strip or mixed ground shows either side of the card (Arsh: fill with theme cream instead of blue). VERIFIED: served section markup carries `bg-ivory`.
- [x] 25. One Way/Round Trip toggle: navy-soft track, champagne slider, navy active label. VERIFIED: screenshot.
- [x] 26. Date/time popovers restyled navy with champagne selected states. VERIFIED: class audit (no light/blue remnants in pickers).
- [x] 27. Submit → champagne "Request Quote"; `/api/booking` flow untouched. VERIFIED: rendered HTML contains champagne submit with new label.

### G. Discover Midline (szqr)
- [x] 28. h2 single color; heading prop now actually wired (CMS heading renders, falls back to "Discover Midline"). VERIFIED: rendered h2 has no span.
- [x] 29. Subtitles no longer rendered (schema/data untouched). VERIFIED: "Elite travel management" appears only in the RSC data payload, not in the DOM.
- [x] 30. Panel CTAs champagne underline; GSAP wipes untouched. VERIFIED: class audit.

### H. Accreditations (szns)
- [x] 31. LogoLoopSection removed from homepage; `getEnabledAccreditations` no longer fetched on `/`; collection + `/safety` list untouched. VERIFIED: "Accreditations & Memberships" absent from homepage DOM; `/safety` still renders memberships.

### I. Fleet cards (sztt, szws, docx §7)
- [x] 32. Images `aspect-video` (16:9) at every breakpoint; overlay gradient + chips removed; HoverVideoCard same ratio. VERIFIED: rendered markup uses `aspect-video`; no chips in DOM.
- [x] 33. Title as Montserrat h3 in the text area; tail-number chip, availability pill, "Fleet" eyebrow all removed. VERIFIED: "T7-MID*" appears on homepage only inside the booking form's jet selector (legit); "Available Now" absent.
- [x] 34. Cards are solid warm-ivory boxes, no border, on a navy section. VERIFIED: section `bg-navy`, article `bg-ivory`, no border class.
- [x] 35. CTA champagne outline → fills champagne on hover; label kept "More Details". VERIFIED: class audit.
- [x] 36. Grid gap up (lg:gap-8), section padding up; 16:9 media makes photography read larger. VERIFIED: class audit.

### J. Homepage choreography (docx §2)
- [x] 37. Surfaces: hero navy → booking navy → Discover ivory → destinations (sweep only) → services ivory → fleet navy w/ ivory cards → CTA banner navy + champagne primary → footer navy. Homepage lands in the 55-65% navy band. VERIFIED: section wrappers audited; `main` uses warm canvas.
- [x] 38. Spacing pass: sections normalized to py-16/20/24 rhythm with larger header gaps. VERIFIED: class audit.

### K. Footer (docx §9)
- [x] 39. `#0A2632` ground (via retinted `inverse-canvas`), enlarged white-treated logo (no white tile), champagne flight-path divider, champagne column headings + hovers, champagne/20 bottom rule, more breathing room, tidied legal/social row. VERIFIED: class audit + fleet-page screenshot bottom.

### L. Brand device (docx §10)
- [x] 40. ~~`FlightPathLine` flight-path element~~ **REMOVED on Arsh's follow-up (2026-08-06): "remove this from everywhere from website".** Component deleted, all six usages (both heroes, three section headings, footer divider) and its CSS stripped. The `.link-underline` hover draw on nav/footer links remains as the only recurring motion device. VERIFIED: `grep -rn "FlightPathLine|flight-path" src/` → no hits; build passes.

### M. Rest-of-site sweep
- [x] 41. All remaining pages/components swept (management ×4, cargo ×3, sales, contact ×4, ChatWidget, CookieConsent, MROComingSoon, fleet sections ×3, JetHero, JetCrossLinks, JourneyStartsHere, OurPhilosophy, WhyChooseUs, LegalPage, faq, gallery, safety, testimonials, JetEditorialGallery); hero scrims → navy tones; stark-white section/main wrappers → warm ivory/canvas. No structural changes. VERIFIED: all 15 routes return 200 with 0 blue occurrences; MRO screenshot fully on-system.

### N. CMS / seed sync
- [x] 42. `home-content.ts` defaults updated (hero heading/eyebrow/subtext, CTA labels); local DB force-seeded (`npx payload run scripts/seed/home-page.mts -- --force`; plain `npm run seed:home -- --force` does NOT forward the flag). VERIFIED: `check-home.mts` shows hero "Your Sky. Your Schedule.", published; dev server renders new copy.
- [x] 43. No Payload schema changes/migrations — only admin field descriptions updated. VERIFIED: no new migration files; build succeeds.

## Ambiguous / conflicting items — resolved
1. Docx "champagne REQUEST QUOTE button" vs screenshot removing hero button → hero has none; nav + form submit relabeled (approved). CTA-banner primary "Book a flight" → "Request Quote" under the same instruction.
2. "9x16 or 10x16" wording vs "horizontal" → landscape 16:9 (approved).
3. Booking form "navy borders **or** dark background" → dark navy card (approved).
4. Dark theme "propose… not necessarily 100%" → implemented as the site's design, dark-led hybrid, entire site (approved).

## Awaiting input / follow-ups for Arsh & client
- **PRODUCTION DB SEED PENDING.** The live Turso DB still holds the old hero copy ("Midline Aviation / Your Sky. …", eyebrow, old labels). The redesigned components render it safely (single color, no eyebrow/button), but to ship the shorter H1 run once at deploy time: `NODE_ENV=production npx payload run scripts/seed/home-page.mts -- --force` (NODE_ENV=production is required — without it dev-mode schema push fires DDL at Turso). Best done together with deploying this code so copy and design land together.
- **Final logo** pending — dark surfaces currently use a CSS-inverted off-white treatment of the existing PNG.
- **Warm ivory / off-white exact hexes** were not specified by the client — proposed values (`#F5F1E8` / `#F1ECE2` / `#FAF7F0`) are used and trivial to swap.
- **AI photo defects** (docx "10. Photos and Visuals") — needs replacement imagery from the client; no code change possible.
- **Copy rewrite** — separate project per client; only the hero H1/subtext trim + CTA labels changed, as instructed.
- Known pre-existing quirk (not from this work): headless-capture of the live site shows the same slight right-edge overflow on very narrow mobile widths as before; worth a look on a real device during the copy project.
