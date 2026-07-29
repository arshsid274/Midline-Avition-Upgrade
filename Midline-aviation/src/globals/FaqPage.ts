import type { GlobalConfig } from 'payload'

import { revalidateGlobalPublished } from '../payload/hooks/revalidate'
import { GLOBAL_ROUTES, buildPreviewURL } from '../payload/preview/routes'

/**
 * The FAQ page.
 *
 * Questions are nested arrays (group → questions) rather than a separate
 * collection: the whole page is thirteen short entries, and keeping them on one
 * screen means an editor sees the running order the way visitors do instead of
 * hopping between a list view and a page. The FAQPage structured data Google
 * reads is generated from these, so adding a question here also adds it there.
 */
export const FaqPage: GlobalConfig = {
  slug: 'faq-page',
  label: 'FAQ',
  access: { read: () => true },
  admin: {
    group: 'Pages',
    description: 'The questions and answers page.',
    preview: () => buildPreviewURL(GLOBAL_ROUTES['faq-page']),
    livePreview: { url: () => buildPreviewURL(GLOBAL_ROUTES['faq-page']) },
  },
  versions: { drafts: { autosave: { interval: 1500 } }, max: 20 },
  hooks: { afterChange: [revalidateGlobalPublished(['/faq'])] },
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
          name: 'groups',
          label: '2 · Questions',
          description: 'Each group is a headed block of expandable questions.',
          fields: [
            {
              name: 'items',
              type: 'array',
              label: 'Question groups',
              labels: { singular: 'Group', plural: 'Groups' },
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/payload/components/RowLabel#GroupRowLabel' },
              },
              fields: [
                { name: 'heading', type: 'text', label: 'Group heading', required: true },
                {
                  name: 'questions',
                  type: 'array',
                  label: 'Questions',
                  labels: { singular: 'Question', plural: 'Questions' },
                  admin: {
                    initCollapsed: true,
                    components: { RowLabel: '@/payload/components/RowLabel#QuestionRowLabel' },
                  },
                  fields: [
                    { name: 'q', type: 'text', label: 'Question', required: true },
                    { name: 'a', type: 'textarea', label: 'Answer', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'closing',
          label: '3 · Blue banner (bottom)',
          description: 'The closing panel with the contact email.',
          fields: [
            { name: 'heading', type: 'text', label: 'Headline' },
            { name: 'bodyBefore', type: 'text', label: 'Text before the email address' },
            { name: 'bodyAfter', type: 'text', label: 'Text after the email address' },
          ],
        },
      ],
    },
  ],
}
