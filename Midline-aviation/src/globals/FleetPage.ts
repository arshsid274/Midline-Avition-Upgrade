import type { GlobalConfig } from 'payload'

import { imageField, sectionHeader } from '../payload/fields/section'
import { linkField } from '../payload/fields/link'
import { videoField } from '../payload/fields/video'
import { revalidateGlobalPublished } from '../payload/hooks/revalidate'
import { GLOBAL_ROUTES, buildPreviewURL } from '../payload/preview/routes'

/**
 * The fleet index page — the header film, the comparison table and the
 * interior mosaic. The aircraft themselves live in Content Library →
 * Aircraft; this global only covers the furniture around them.
 */
export const FleetPage: GlobalConfig = {
  slug: 'fleet-page',
  label: 'Fleet',
  access: { read: () => true },
  admin: {
    group: 'Pages',
    description: 'The fleet overview page. The aircraft themselves are edited in Aircraft.',
    preview: () => buildPreviewURL(GLOBAL_ROUTES['fleet-page']),
    livePreview: { url: () => buildPreviewURL(GLOBAL_ROUTES['fleet-page']) },
  },
  versions: { drafts: { autosave: { interval: 1500 } }, max: 20 },
  hooks: { afterChange: [revalidateGlobalPublished(['/fleet'])] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: '1 · Page header film',
          description: 'The full-width film at the top of the page.',
          fields: [
            { name: 'heading', type: 'text', label: 'Headline' },
            { name: 'body', type: 'textarea', label: 'Line under the headline' },
            videoField({ name: 'videoUrl', label: 'Background film' }),
            imageField({ name: 'poster', label: 'Still image behind the film' }),
          ],
        },
        {
          name: 'comparison',
          label: '2 · Specifications table',
          description: 'The side-by-side comparison of the three aircraft.',
          fields: [
            ...sectionHeader(),
            {
              name: 'aircraftNote',
              type: 'ui',
              admin: { components: { Field: '@/payload/components/SectionNote#AircraftNote' } },
            },
          ],
        },
        {
          name: 'interior',
          label: '3 · Interior gallery',
          description: 'The mosaic of cabin photographs near the bottom.',
          fields: [
            { name: 'heading', type: 'text', label: 'Headline' },
            linkField({ name: 'link', label: 'Link under the mosaic' }),
            {
              name: 'tiles',
              type: 'array',
              label: 'Photos',
              labels: { singular: 'Photo', plural: 'Photos' },
              admin: {
                description: 'The first photo is the large one.',
                components: { RowLabel: '@/payload/components/RowLabel#GalleryRowLabel' },
              },
              fields: [
                imageField({ name: 'image', label: 'Photo', required: true }),
                { name: 'caption', type: 'text', label: 'Caption (large tile only)' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
