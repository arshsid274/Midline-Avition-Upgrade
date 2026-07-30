import type { GlobalConfig } from 'payload'

import { statArray } from '../payload/fields/section'
import { revalidateGlobalPublished } from '../payload/hooks/revalidate'
import { GLOBAL_ROUTES, buildPreviewURL } from '../payload/preview/routes'

/** Facts rendered as label/value pairs, reused by two sections here. */
const factArray = (description: string) => ({
  name: 'facts',
  type: 'array' as const,
  label: 'Facts',
  labels: { singular: 'Fact', plural: 'Facts' },
  admin: {
    description,
    components: { RowLabel: '@/payload/components/RowLabel#FactRowLabel' },
  },
  fields: [
    {
      type: 'row' as const,
      fields: [
        { name: 'label', type: 'text' as const, label: 'Label', required: true, admin: { width: '45%' } },
        { name: 'value', type: 'text' as const, label: 'Value', required: true, admin: { width: '55%' } },
      ],
    },
  ],
})

export const SafetyPage: GlobalConfig = {
  slug: 'safety-page',
  label: 'Safety & Certifications',
  access: { read: () => true },
  admin: {
    group: 'Pages',
    description: 'The safety page. Tabs run top to bottom in the order visitors scroll.',
    preview: () => buildPreviewURL(GLOBAL_ROUTES['safety-page']),
    livePreview: { url: () => buildPreviewURL(GLOBAL_ROUTES['safety-page']) },
  },
  versions: { drafts: { autosave: { interval: 1500 } }, max: 20 },
  hooks: { afterChange: [revalidateGlobalPublished(['/safety'])] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: '1 · Page header',
          description: 'The dark band at the top of the page.',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Small line above the headline' },
            { name: 'heading', type: 'text', label: 'Headline' },
            { name: 'body', type: 'textarea', label: 'Paragraph under the headline' },
          ],
        },
        {
          name: 'operator',
          label: '2 · Certificated operator',
          description: 'Who actually operates the aircraft, with the three fact boxes.',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Small line above the headline' },
            { name: 'heading', type: 'text', label: 'Headline' },
            { name: 'body', type: 'textarea', label: 'Paragraph' },
            factArray('The three boxes under the paragraph.'),
          ],
        },
        {
          name: 'ratings',
          label: '3 · Safety ratings & audits',
          description: 'The single bordered card describing the IS-BAO standard.',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Small line above the headline' },
            { name: 'heading', type: 'text', label: 'Headline' },
            { name: 'cardTitle', type: 'text', label: 'Card title' },
            { name: 'cardBody', type: 'textarea', label: 'Card text' },
          ],
        },
        {
          name: 'memberships',
          label: '4 · Memberships grid',
          description: 'The grid of industry logos.',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Small line above the headline' },
            { name: 'heading', type: 'text', label: 'Headline' },
            {
              name: 'membershipsNote',
              type: 'ui',
              admin: {
                components: { Field: '@/payload/components/SectionNote#MembershipsNote' },
              },
            },
          ],
        },
        {
          name: 'insurance',
          label: '5 · Insurance band',
          description: 'The dark strip with the single insurance sentence.',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Small line above the text' },
            { name: 'body', type: 'textarea', label: 'Sentence' },
          ],
        },
        {
          name: 'maintenance',
          label: '6 · Maintenance & crew',
          description: 'Maintenance and crew training, with three fact tiles.',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Small line above the headline' },
            { name: 'heading', type: 'text', label: 'Headline' },
            { name: 'body', type: 'textarea', label: 'Paragraph' },
            factArray('The three tiles under the paragraph.'),
          ],
        },
        {
          name: 'questions',
          label: '7 · Questions band (bottom)',
          description: 'The closing band with the contact email.',
          fields: [
            { name: 'heading', type: 'text', label: 'Headline' },
            {
              name: 'body',
              type: 'textarea',
              label: 'Text after the email address',
              admin: {
                description:
                  'The contact email is inserted automatically before this text.',
              },
            },
          ],
        },
      ],
    },
  ],
}
