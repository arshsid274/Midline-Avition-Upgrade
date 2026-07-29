import type { GlobalConfig } from 'payload'

import { headingField } from '../payload/fields/heading'
import { linkField } from '../payload/fields/link'
import { videoField } from '../payload/fields/video'
import { revalidateGlobalPublished } from '../payload/hooks/revalidate'
import { GLOBAL_ROUTES, buildPreviewURL } from '../payload/preview/routes'

/**
 * The home page, modelled as the marketer sees it.
 *
 * Tabs are the page's own sections, numbered in the order you scroll past
 * them, so someone looking at a band on the live site can find its tab without
 * knowing a single component name. Tabs rather than one long form because with
 * live preview open the editor sits in a narrow column, where a tab strip stays
 * a visible table of contents and a stack of collapsibles does not.
 *
 * A global rather than a row in a `pages` collection: this route is fixed by
 * the filesystem and has a section composition shared with no other page. A
 * collection would mean either one field set that fits none of the pages, or a
 * blocks page-builder — a kit of parts to assemble, which is the opposite of
 * mirroring the page. It would also let someone delete the home page.
 */
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Pages',
    description:
      'Everything on the home page. Tabs run top to bottom in the order visitors scroll through them.',
    // The "Preview" button — opens the real page in a new tab, in draft mode.
    preview: () => buildPreviewURL(GLOBAL_ROUTES['home-page']),
    // The side-by-side iframe. Payload strips `url` from the client config, so
    // PREVIEW_SECRET never reaches the browser bundle.
    livePreview: {
      url: () => buildPreviewURL(GLOBAL_ROUTES['home-page']),
    },
  },
  versions: {
    drafts: {
      autosave: { interval: 1500 },
    },
    max: 20,
  },
  hooks: {
    // Only a publish (or an unpublish) should bust the cache. Without the
    // guard, autosave would fire revalidatePath every 1.5s while someone types,
    // thrashing the cache for output that has not changed.
    afterChange: [revalidateGlobalPublished(['/'])],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ── 1 ─────────────────────────────────────────────────────────────
        {
          name: 'hero',
          label: '1 · Hero (top of page)',
          description:
            'The full-screen video at the very top of the page, above the booking form.',
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              label: 'Small line above the headline',
            },
            headingField({ description: 'The large headline over the video.' }),
            {
              name: 'body',
              type: 'textarea',
              label: 'Paragraph under the headline',
            },
            linkField({ name: 'cta', label: 'Blue button', required: true }),
            videoField({ name: 'videoUrl', label: 'Background video', required: true }),
            {
              name: 'poster',
              type: 'upload',
              relationTo: 'media',
              label: 'Still image behind the video',
              admin: {
                description:
                  'Shown while the video loads. This is the first thing visitors see, so pick a sharp frame.',
              },
            },
            {
              name: 'bookingFormNote',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/payload/components/SectionNote#BookingFormNote',
                },
              },
            },
          ],
        },

        // ── 7 ─────────────────────────────────────────────────────────────
        // Numbered 7 because it is the seventh band on the page; the sections
        // between it and the hero are migrated in later commits and will slot
        // in above without renumbering this one.
        {
          name: 'ctaBanner',
          label: '7 · Blue banner (bottom)',
          description:
            'The solid blue panel just above the footer, at the very bottom of the page.',
          fields: [
            {
              name: 'heading',
              type: 'text',
              label: 'Headline',
            },
            {
              name: 'body',
              type: 'textarea',
              label: 'Paragraph under the headline',
            },
            linkField({ name: 'primary', label: 'White button (left)' }),
            linkField({ name: 'secondary', label: 'Outlined button (right)' }),
          ],
        },
      ],
    },
  ],
}
