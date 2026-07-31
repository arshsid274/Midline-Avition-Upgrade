import type { Field, GlobalConfig } from 'payload'

import { cardArray, imageField, sectionHeader, statArray } from '../payload/fields/section'
import { iconField } from '../payload/fields/icon'
import { linkField } from '../payload/fields/link'
import { revalidateGlobalPublished } from '../payload/hooks/revalidate'
import { GLOBAL_ROUTES, buildPreviewURL } from '../payload/preview/routes'

/**
 * The five service pages share a shape — a picture-led header, one or two
 * blocks of cards, and a closing band — so they are generated from one factory
 * rather than hand-written five times. Each page passes its own labels and
 * says which optional blocks it actually has, so the tabs an editor sees still
 * match that specific page rather than a lowest common denominator.
 */
export const makeServicePage = ({
  slug,
  label,
  path,
  featureCardsLabel,
  featureCardsHelp,
  imageCardsLabel,
  imageCardsHelp,
  withStats = false,
  withClosing = true,
}: {
  slug: string
  label: string
  path: string
  featureCardsLabel?: string
  featureCardsHelp?: string
  imageCardsLabel?: string
  imageCardsHelp?: string
  withStats?: boolean
  withClosing?: boolean
}): GlobalConfig => ({
  slug,
  label,
  access: { read: () => true },
  admin: {
    group: 'Pages',
    description: `The ${label.toLowerCase()} page. Tabs run top to bottom in the order visitors scroll.`,
    preview: () => buildPreviewURL(GLOBAL_ROUTES[slug] ?? path),
    livePreview: { url: () => buildPreviewURL(GLOBAL_ROUTES[slug] ?? path) },
  },
  versions: { drafts: { autosave: { interval: 1500 } }, max: 20 },
  hooks: { afterChange: [revalidateGlobalPublished([path])] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: '1 · Page header',
          description: 'The picture-led band at the very top of the page.',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Small line above the headline' } as Field,
            { name: 'heading', type: 'text', label: 'Headline' } as Field,
            { name: 'headingAccent', type: 'text', label: 'Second line of the headline' } as Field,
            { name: 'body', type: 'textarea', label: 'Paragraph under the headline' } as Field,
            imageField({ name: 'image', label: 'Background picture' }),
            linkField({ name: 'primary', label: 'First button' }),
            linkField({ name: 'secondary', label: 'Second button' }),
            ...(withStats ? [statArray({ description: 'The figures shown under the buttons.' })] : []),
          ],
        },
        ...(featureCardsLabel
          ? [
              {
                name: 'features',
                label: `2 · ${featureCardsLabel}`,
                description: featureCardsHelp,
                fields: [
                  ...sectionHeader(),
                  cardArray({
                    name: 'cards',
                    label: featureCardsLabel,
                    labelSingular: 'Card',
                    withImage: false,
                    withLink: false,
                    extraFields: [
                      // These cards are rendered with a pictogram, not a photo,
                      // so the icon takes the place cardArray's image would
                      // normally occupy.
                      iconField(),
                      {
                        name: 'points',
                        type: 'array',
                        label: 'Bullet points',
                        labels: { singular: 'Point', plural: 'Points' },
                        fields: [
                          { name: 'text', type: 'text', label: 'Text', required: true } as Field,
                        ],
                      } as Field,
                    ],
                  }),
                ],
              },
            ]
          : []),
        ...(imageCardsLabel
          ? [
              {
                name: 'showcase',
                label: `${featureCardsLabel ? '3' : '2'} · ${imageCardsLabel}`,
                description: imageCardsHelp,
                fields: [
                  ...sectionHeader(),
                  cardArray({
                    name: 'cards',
                    label: imageCardsLabel,
                    labelSingular: 'Card',
                    withImage: true,
                    withLink: true,
                  }),
                ],
              },
            ]
          : []),
        ...(withClosing
          ? [
              {
                name: 'closing',
                label: 'Closing band (bottom)',
                description: 'The panel just above the footer.',
                fields: [
                  { name: 'eyebrow', type: 'text', label: 'Small line above the headline' } as Field,
                  { name: 'heading', type: 'text', label: 'Headline' } as Field,
                  { name: 'body', type: 'textarea', label: 'Paragraph' } as Field,
                  linkField({ name: 'cta', label: 'Button' }),
                ],
              },
            ]
          : []),
      ],
    },
  ],
})
