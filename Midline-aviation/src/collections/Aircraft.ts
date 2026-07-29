import type { CollectionConfig } from 'payload'

import { imageField } from '../payload/fields/section'
import { videoField } from '../payload/fields/video'
import { revalidatePathsFor } from '../payload/hooks/revalidate'

/**
 * The fleet. One document per aircraft, feeding /fleet, each /fleet/[slug]
 * page, the home page cards and the footer links.
 *
 * A collection, not a global: aircraft come and go, and each is the same shape.
 * This is also the single source that replaces the seven places the same three
 * jets were previously described.
 *
 * The old JetImage type carried width, height and orientation. None of them
 * was read by any component — every image renders with `fill` — so they are
 * not modelled here; Payload records real dimensions on the media document
 * anyway. `span` is kept because the editorial gallery genuinely uses it.
 */
export const Aircraft: CollectionConfig = {
  slug: 'aircraft',
  access: { read: () => true },
  admin: {
    group: 'Content Library',
    useAsTitle: 'name',
    defaultColumns: ['name', 'tail', 'category', 'order'],
    description: 'Each aircraft has its own page at /fleet/<web address>.',
  },
  defaultSort: 'order',
  hooks: {
    afterChange: [
      revalidatePathsFor((doc) => [`/fleet/${doc.slug}`, '/fleet', '/', '/sitemap.xml']),
    ],
    afterDelete: [
      revalidatePathsFor((doc) => [`/fleet/${doc.slug}`, '/fleet', '/', '/sitemap.xml']),
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            { name: 'name', type: 'text', required: true, label: 'Aircraft name' },
            {
              type: 'row',
              fields: [
                { name: 'tail', type: 'text', required: true, label: 'Tail number', admin: { width: '50%' } },
                { name: 'category', type: 'text', label: 'Class, e.g. Heavy', admin: { width: '50%' } },
              ],
            },
            { name: 'tagline', type: 'textarea', label: 'One-line description' },
            {
              name: 'description',
              type: 'array',
              label: 'Paragraphs',
              labels: { singular: 'Paragraph', plural: 'Paragraphs' },
              fields: [{ name: 'text', type: 'textarea', label: 'Text', required: true }],
            },
            {
              name: 'specs',
              type: 'array',
              label: 'Performance figures',
              labels: { singular: 'Figure', plural: 'Figures' },
              admin: {
                description: 'The tiles in the "at a glance" band.',
                components: { RowLabel: '@/payload/components/RowLabel#SpecRowLabel' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, label: 'Label', admin: { width: '40%' } },
                    { name: 'value', type: 'number', required: true, label: 'Number', admin: { width: '20%' } },
                    { name: 'unit', type: 'text', label: 'Unit', admin: { width: '20%' } },
                    { name: 'decimals', type: 'number', label: 'Decimals', admin: { width: '20%' } },
                  ],
                },
                { name: 'note', type: 'text', label: 'Small print under the figure' },
                {
                  name: 'displayValue',
                  type: 'text',
                  label: 'Show this text instead',
                  admin: {
                    description:
                      'For values that are not a plain number, e.g. a cabin height. Overrides the number and stops it counting up.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Pictures & film',
          fields: [
            imageField({
              name: 'heroImage',
              label: 'Main picture',
              required: true,
              description: 'Fills the top of the aircraft page.',
            }),
            videoField({
              name: 'heroVideoUrl',
              label: 'Header film (optional)',
              description: 'Plays behind the header instead of the picture. Leave empty for a photo header.',
            }),
            {
              name: 'gallery',
              type: 'array',
              label: 'Photo grid',
              labels: { singular: 'Photo', plural: 'Photos' },
              admin: {
                initCollapsed: true,
                description: 'The editorial grid further down the page.',
                components: { RowLabel: '@/payload/components/RowLabel#GalleryRowLabel' },
              },
              fields: [
                imageField({ name: 'image', label: 'Photo', required: true }),
                {
                  name: 'span',
                  type: 'select',
                  label: 'Tile size',
                  defaultValue: 'standard',
                  options: [
                    { label: 'Standard', value: 'standard' },
                    { label: 'Wide', value: 'wide' },
                    { label: 'Tall', value: 'tall' },
                  ],
                },
              ],
            },
            {
              name: 'verticalVideo',
              type: 'group',
              label: 'Cabin tour (phone-shaped film)',
              fields: [
                videoField({ name: 'url', label: 'Film' }),
                imageField({ name: 'poster', label: 'Still' }),
                { name: 'heading', type: 'text', label: 'Headline' },
                { name: 'caption', type: 'textarea', label: 'Caption' },
              ],
            },
          ],
        },
        {
          label: 'Web address & search',
          fields: [
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              label: 'Web address',
              admin: {
                description:
                  'The page lives at /fleet/<this>. Changing it breaks existing links — avoid once published.',
              },
            },
            { name: 'seoTitle', type: 'text', label: 'Search result title' },
            { name: 'seoDescription', type: 'textarea', label: 'Search result description' },
            {
              name: 'seoKeywords',
              type: 'array',
              label: 'Keywords',
              labels: { singular: 'Keyword', plural: 'Keywords' },
              fields: [{ name: 'keyword', type: 'text', required: true }],
            },
            {
              name: 'ogImage',
              type: 'text',
              label: 'Share image path',
              admin: { description: 'The 1200x630 banner used when the page is shared.' },
            },
            { name: 'order', type: 'number', defaultValue: 0, label: 'Position in the fleet list' },
          ],
        },
      ],
    },
  ],
}
