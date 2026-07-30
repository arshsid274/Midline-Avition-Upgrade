import type { GlobalConfig } from 'payload'

import { imageField } from '../payload/fields/section'
import { linkField } from '../payload/fields/link'
import { revalidateGlobalPublished } from '../payload/hooks/revalidate'
import { GLOBAL_ROUTES, buildPreviewURL } from '../payload/preview/routes'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About',
  access: { read: () => true },
  admin: {
    group: 'Pages',
    description: 'The about page — what we do, our story, and the leadership team.',
    preview: () => buildPreviewURL(GLOBAL_ROUTES['about-page']),
    livePreview: { url: () => buildPreviewURL(GLOBAL_ROUTES['about-page']) },
  },
  versions: { drafts: { autosave: { interval: 1500 } }, max: 20 },
  hooks: { afterChange: [revalidateGlobalPublished(['/about'])] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'whatWeDo',
          label: '1 · What we do',
          description: 'The tabbed block at the top — one picture and description per tab.',
          fields: [
            { name: 'heading', type: 'text', label: 'Page headline' },
            {
              name: 'slides',
              type: 'array',
              label: 'Tabs',
              labels: { singular: 'Tab', plural: 'Tabs' },
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/payload/components/RowLabel#CardRowLabel' },
              },
              fields: [
                { name: 'label', type: 'text', label: 'Tab button text', required: true },
                { name: 'title', type: 'text', label: 'Headline', required: true },
                { name: 'description', type: 'textarea', label: 'Paragraph' },
                imageField({ name: 'image', label: 'Picture' }),
                linkField({ name: 'link', label: 'Button' }),
                {
                  name: 'imagePosition',
                  type: 'text',
                  admin: {
                    description:
                      'Which part of the picture stays visible when cropped, e.g. "center 40%". Leave as-is unless a face or tail is being cut off.',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'story',
          label: '2 · Our story',
          description: 'The picture-and-text block about the company history.',
          fields: [
            { name: 'heading', type: 'text', label: 'Headline' },
            {
              name: 'paragraphs',
              type: 'array',
              label: 'Paragraphs',
              labels: { singular: 'Paragraph', plural: 'Paragraphs' },
              fields: [{ name: 'text', type: 'textarea', label: 'Text', required: true }],
            },
            imageField({ name: 'image', label: 'Picture' }),
          ],
        },
        {
          name: 'sustainability',
          label: '3 · Sustainability & Innovation',
          description: 'The wide banner with the overlapping card.',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Small line above the headline' },
            { name: 'heading', type: 'text', label: 'Headline' },
            { name: 'intro', type: 'textarea', label: 'Introduction' },
            imageField({ name: 'image', label: 'Background picture' }),
            { name: 'cardTitle', type: 'text', label: 'Card title' },
            { name: 'cardBody', type: 'textarea', label: 'Card text' },
            {
              name: 'points',
              type: 'array',
              label: 'Bullet points',
              labels: { singular: 'Point', plural: 'Points' },
              fields: [{ name: 'text', type: 'text', label: 'Text', required: true }],
            },
            linkField({ name: 'link', label: 'Link' }),
          ],
        },
        {
          name: 'leadership',
          label: '4 · Our Leadership',
          description: 'The team cards at the bottom of the page.',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Small line above the headline' },
            { name: 'heading', type: 'text', label: 'Headline' },
            { name: 'intro', type: 'textarea', label: 'Introduction' },
            {
              name: 'members',
              type: 'array',
              label: 'Team members',
              labels: { singular: 'Person', plural: 'People' },
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/payload/components/RowLabel#PersonRowLabel' },
              },
              fields: [
                { name: 'name', type: 'text', label: 'Name', required: true },
                { name: 'title', type: 'text', label: 'Job title', required: true },
                { name: 'bio', type: 'textarea', label: 'Short biography' },
                imageField({ name: 'photo', label: 'Photo' }),
                {
                  name: 'objectPosition',
                  type: 'text',
                  admin: {
                    description:
                      'Which part of the photo stays visible when cropped, e.g. "center 20%". Adjust if a face is cut off.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
