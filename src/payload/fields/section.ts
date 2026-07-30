import type { Field } from 'payload'

import { linkField } from './link'

/**
 * Building blocks for the patterns that repeat across the site.
 *
 * The page map turned up five shapes used over and over: a section header, a
 * grid of image cards, a stat strip, a hero, and a closing banner. Assembling
 * every page global from these means thirteen assembly jobs rather than
 * thirteen bespoke schemas — and an editor who learns one section has learned
 * them all, because the field names and descriptions are identical everywhere.
 */

/** Eyebrow + heading + intro — the lead-in above almost every band on the site. */
export const sectionHeader = ({
  includeEyebrow = true,
  includeIntro = true,
  headingLabel = 'Headline',
}: {
  includeEyebrow?: boolean
  includeIntro?: boolean
  headingLabel?: string
} = {}): Field[] => [
  ...(includeEyebrow
    ? ([
        {
          name: 'eyebrow',
          type: 'text',
          label: 'Small line above the headline',
        },
      ] as Field[])
    : []),
  {
    name: 'heading',
    type: 'text',
    label: headingLabel,
  },
  ...(includeIntro
    ? ([
        {
          name: 'intro',
          type: 'textarea',
          label: 'Introduction paragraph',
        },
      ] as Field[])
    : []),
]

/** An image with its own alt text, for cards and panels. */
export const imageField = ({
  name = 'image',
  label = 'Picture',
  required = false,
  description,
}: {
  name?: string
  label?: string
  required?: boolean
  description?: string
} = {}): Field => ({
  name,
  type: 'upload',
  relationTo: 'media',
  label,
  required,
  admin: description ? { description } : undefined,
})

/**
 * A repeating row of cards. `RowLabel` shows the card's own title when
 * collapsed, so a list of six reads as its contents rather than "Item 1..6".
 */
export const cardArray = ({
  name = 'cards',
  label = 'Cards',
  labelSingular = 'Card',
  description,
  extraFields = [],
  withImage = true,
  withLink = true,
}: {
  name?: string
  label?: string
  labelSingular?: string
  description?: string
  extraFields?: Field[]
  withImage?: boolean
  withLink?: boolean
} = {}): Field => ({
  name,
  type: 'array',
  label,
  labels: { singular: labelSingular, plural: label },
  admin: {
    description,
    initCollapsed: true,
    components: {
      RowLabel: '@/payload/components/RowLabel#CardRowLabel',
    },
  },
  fields: [
    { name: 'title', type: 'text', label: 'Title', required: true },
    { name: 'description', type: 'textarea', label: 'Description' },
    ...(withImage ? [imageField({ name: 'image', label: 'Picture' })] : []),
    ...(withLink ? [linkField({ name: 'link', label: 'Link' })] : []),
    ...extraFields,
  ],
})

/** value + label pairs, e.g. "1200+ / Global Destinations". */
export const statArray = ({
  name = 'stats',
  label = 'Numbers strip',
  description,
}: { name?: string; label?: string; description?: string } = {}): Field => ({
  name,
  type: 'array',
  label,
  labels: { singular: 'Number', plural: 'Numbers' },
  admin: {
    description: description ?? 'The large figures shown side by side.',
    initCollapsed: true,
    components: { RowLabel: '@/payload/components/RowLabel#StatRowLabel' },
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'value', type: 'text', label: 'Figure', required: true, admin: { width: '40%' } },
        { name: 'label', type: 'text', label: 'Caption', required: true, admin: { width: '60%' } },
      ],
    },
  ],
})
