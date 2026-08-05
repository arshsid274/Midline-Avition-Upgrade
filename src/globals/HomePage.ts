import type { GlobalConfig } from 'payload'

import { headingField } from '../payload/fields/heading'
import { linkField } from '../payload/fields/link'
import { videoField } from '../payload/fields/video'
import { cardArray, imageField, sectionHeader } from '../payload/fields/section'
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

        // ── 2 ─────────────────────────────────────────────────────────────
        {
          name: 'showcase',
          label: '2 · Discover Midline',
          description:
            'The two large picture-and-text panels below the booking form. They alternate sides down the page.',
          fields: [
            { name: 'heading', type: 'text', label: 'Section headline' },
            {
              name: 'panels',
              type: 'array',
              label: 'Panels',
              labels: { singular: 'Panel', plural: 'Panels' },
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/payload/components/RowLabel#CardRowLabel' },
              },
              fields: [
                { name: 'title', type: 'text', label: 'Title', required: true },
                { name: 'subtitle', type: 'text', label: 'Line under the title' },
                { name: 'description', type: 'textarea', label: 'Paragraph' },
                imageField({ name: 'image', label: 'Picture' }),
                linkField({ name: 'link', label: 'Button' }),
                {
                  name: 'imageOnRight',
                  type: 'checkbox',
                  label: 'Show the picture on the right',
                  admin: {
                    description: 'Alternate this between panels so the page zig-zags.',
                  },
                },
              ],
            },
          ],
        },

        // ── 3 ─────────────────────────────────────────────────────────────
        {
          name: 'destinations',
          label: '3 · Popular Destinations',
          description: 'The sliding row of city cards.',
          fields: [
            ...sectionHeader({ includeEyebrow: false }),
            cardArray({
              name: 'cards',
              label: 'Destination cards',
              labelSingular: 'Destination',
              description: 'Drag to reorder. These scroll horizontally on the page.',
              withImage: true,
              withLink: true,
            }),
          ],
        },

        // ── 4 ─────────────────────────────────────────────────────────────
        {
          name: 'accreditations',
          label: '4 · Accreditations strip',
          description: 'The scrolling row of industry logos.',
          fields: [
            { name: 'heading', type: 'text', label: 'Section headline' },
            {
              name: 'accreditationsNote',
              type: 'ui',
              admin: {
                components: { Field: '@/payload/components/SectionNote#AccreditationsNote' },
              },
            },
          ],
        },

        // ── 5 ─────────────────────────────────────────────────────────────
        {
          name: 'fleet',
          label: '5 · Our Fleet',
          description: 'The three aircraft cards near the bottom of the page.',
          fields: [
            ...sectionHeader(),
            cardArray({
              name: 'cards',
              label: 'Aircraft cards',
              labelSingular: 'Aircraft',
              withImage: true,
              withLink: true,
              extraFields: [
                { name: 'registration', type: 'text', label: 'Tail number' },
                {
                  name: 'comingSoon',
                  type: 'checkbox',
                  label: 'Mark as "Coming Soon"',
                  admin: { description: 'Otherwise the card reads "Available Now".' },
                },
                videoField({
                  name: 'videoUrl',
                  label: 'Hover video (optional)',
                  description:
                    'Plays when someone hovers the card. Leave empty to show only the picture.',
                }),
              ],
            }),
          ],
        },

        // ── 6 ─────────────────────────────────────────────────────────────
        {
          name: 'ctaBanner',
          label: '6 · Blue banner (bottom)',
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
