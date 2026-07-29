import type { GlobalConfig } from 'payload'

import { imageField } from '../payload/fields/section'
import { videoField } from '../payload/fields/video'
import { revalidateGlobalPublished } from '../payload/hooks/revalidate'
import { GLOBAL_ROUTES, buildPreviewURL } from '../payload/preview/routes'

/**
 * The contact page: a full-screen video with the contact details over it and
 * the enquiry form beside it.
 */
export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact',
  access: { read: () => true },
  admin: {
    group: 'Pages',
    description: 'The contact page — background video, contact details, and the enquiry form.',
    preview: () => buildPreviewURL(GLOBAL_ROUTES['contact-page']),
    livePreview: { url: () => buildPreviewURL(GLOBAL_ROUTES['contact-page']) },
  },
  versions: { drafts: { autosave: { interval: 1500 } }, max: 20 },
  hooks: { afterChange: [revalidateGlobalPublished(['/contact'])] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: '1 · Page header & video',
          description: 'Fills the whole screen. The enquiry form sits on top of it, to the right.',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Small line above the headline' },
            { name: 'heading', type: 'text', label: 'Headline' },
            { name: 'body', type: 'textarea', label: 'Paragraph under the headline' },
            videoField({ name: 'videoUrl', label: 'Background video' }),
            imageField({
              name: 'poster',
              label: 'Still image behind the video',
              description: 'Shown while the video loads.',
            }),
          ],
        },
        {
          name: 'details',
          label: '2 · Contact details',
          description: 'The four boxes under the headline: address, email, phone, opening hours.',
          fields: [
            {
              name: 'rows',
              type: 'array',
              label: 'Detail rows',
              labels: { singular: 'Detail', plural: 'Details' },
              admin: {
                components: { RowLabel: '@/payload/components/RowLabel#ContactRowLabel' },
              },
              fields: [
                {
                  name: 'kind',
                  type: 'select',
                  label: 'Type',
                  required: true,
                  options: [
                    { label: 'Address', value: 'address' },
                    { label: 'Email', value: 'email' },
                    { label: 'Phone', value: 'phone' },
                    { label: 'Opening hours', value: 'hours' },
                  ],
                  admin: { description: 'Chooses the icon shown beside it.' },
                },
                { name: 'value', type: 'text', label: 'Text shown', required: true },
                {
                  name: 'href',
                  type: 'text',
                  label: 'Tap target',
                  admin: {
                    description:
                      'Only for email and phone — mailto:someone@example.com or tel:+9714... Leave empty otherwise.',
                  },
                },
              ],
            },
            {
              name: 'formNote',
              type: 'ui',
              admin: {
                components: { Field: '@/payload/components/SectionNote#ContactFormNote' },
              },
            },
          ],
        },
      ],
    },
  ],
}
