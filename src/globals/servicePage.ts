import type { Field, GlobalConfig } from 'payload'

import { cardArray, chipArray, imageField, sectionHeader, statArray } from '../payload/fields/section'
import { iconField } from '../payload/fields/icon'
import { linkField } from '../payload/fields/link'
import { revalidateGlobalPublished } from '../payload/hooks/revalidate'
import { GLOBAL_ROUTES, buildPreviewURL } from '../payload/preview/routes'

/**
 * The five service pages share a shape — a picture-led header, one or two
 * blocks of cards, and sometimes a closing band — so they are generated from
 * one factory rather than hand-written five times. Each page says which blocks
 * it actually has, so the tabs an editor sees match that specific page rather
 * than a lowest common denominator.
 *
 * The governing rule: **a tab exists only if the page renders it.** A control
 * that looks editable and changes nothing is worse than an absent one, because
 * the editor types, publishes, sees no change, and concludes the CMS is broken.
 */
type ServicePageOptions = {
  slug: string
  label: string
  path: string

  /** MRO runs a second paragraph and a trust line under the buttons. */
  heroExtras?: boolean
  /** Figures under the hero buttons. */
  withStats?: boolean

  /** Management's "Setting New Standards" band: copy, two cards, a portrait. */
  standardsLabel?: string
  standardsHelp?: string

  /** A plain band of prose, as on the sales page. */
  introLabel?: string
  introHelp?: string

  featureCardsLabel?: string
  featureCardsHelp?: string
  /** Cargo highlights one card. */
  featureCardsFeatured?: boolean

  imageCardsLabel?: string
  imageCardsHelp?: string
  /** Names the small label on a picture card, and by existing, enables it. */
  showcaseBadgeLabel?: string
  /** Sales' advisory blocks lead with a pictogram. */
  showcaseIcon?: boolean
  /** Cargo shows figures beneath the picture cards. */
  showcaseStatsHelp?: string

  /** A grid of short labelled items — sales' "Comprehensive Services". */
  chipsLabel?: string
  chipsHelp?: string
  chipsSingular?: string

  withClosing?: boolean
}

export const makeServicePage = ({
  slug,
  label,
  path,
  heroExtras = false,
  withStats = false,
  standardsLabel,
  standardsHelp,
  introLabel,
  introHelp,
  featureCardsLabel,
  featureCardsHelp,
  featureCardsFeatured = false,
  imageCardsLabel,
  imageCardsHelp,
  showcaseBadgeLabel,
  showcaseIcon = false,
  showcaseStatsHelp,
  chipsLabel,
  chipsHelp,
  chipsSingular = 'Item',
  withClosing = true,
}: ServicePageOptions): GlobalConfig => {
  /**
   * Tabs in scroll order. Assembled first, numbered second — the numbers used
   * to be written by hand (`${featureCardsLabel ? '3' : '2'}`), which silently
   * produces two tabs both labelled "2 ·" the moment another tab is added.
   */
  const numbered: { name: string; label: string; description?: string; fields: Field[] }[] = [
    {
      name: 'hero',
      label: 'Page header',
      description: 'The picture-led band at the very top of the page.',
      fields: [
        { name: 'eyebrow', type: 'text', label: 'Small line above the headline' } as Field,
        { name: 'heading', type: 'text', label: 'Headline' } as Field,
        /**
         * The headline is three fields on every page, not just the pages that
         * currently highlight something. Each page styles its own accent — a
         * white chip on management, blue on cargo, blue italic on MRO — so the
         * words live here and the appearance stays in the component, where an
         * editor cannot break the SplitText reveal by pasting markup.
         *
         * Charter and sales leave the accent empty today and render one plain
         * line. Offering the field anyway costs an empty column and means they
         * can highlight a word later without a schema change.
         */
        {
          name: 'headingAccent',
          type: 'text',
          label: 'Highlighted words',
          admin: {
            description: 'Shown in this page’s accent style. Leave empty for a plain headline.',
          },
        } as Field,
        {
          name: 'headingRest',
          type: 'text',
          label: 'Words after the highlight',
          admin: { description: 'Leave empty if the headline ends at the highlighted words.' },
        } as Field,
        { name: 'body', type: 'textarea', label: 'Paragraph under the headline' } as Field,
        ...(heroExtras
          ? ([
              { name: 'bodySecondary', type: 'textarea', label: 'Second paragraph' },
              {
                name: 'footnote',
                type: 'text',
                label: 'Small line under the buttons',
                admin: { description: 'e.g. “Certified engineers · OEM-aligned procedures”.' },
              },
            ] as Field[])
          : []),
        imageField({ name: 'image', label: 'Background picture' }),
        linkField({ name: 'primary', label: 'First button' }),
        linkField({ name: 'secondary', label: 'Second button' }),
        ...(withStats ? [statArray({ description: 'The figures shown under the buttons.' })] : []),
      ],
    },

    ...(standardsLabel
      ? [
          {
            name: 'standards',
            label: standardsLabel,
            description: standardsHelp,
            fields: [
              ...sectionHeader({ headingLabel: 'Headline' }),
              {
                name: 'headingAccent',
                type: 'text',
                label: 'Highlighted words at the end of the headline',
              } as Field,
              cardArray({
                name: 'cards',
                label: 'Points',
                labelSingular: 'Point',
                withImage: false,
                withLink: false,
                extraFields: [iconField()],
              }),
              imageField({ name: 'image', label: 'Picture beside the text' }),
              { name: 'figureValue', type: 'text', label: 'Figure over the picture' } as Field,
              { name: 'figureLabel', type: 'text', label: 'What the figure means' } as Field,
            ],
          },
        ]
      : []),

    ...(introLabel
      ? [
          {
            name: 'intro',
            label: introLabel,
            description: introHelp,
            fields: [
              ...sectionHeader({ includeIntro: false }),
              {
                name: 'paragraphs',
                type: 'array',
                label: 'Paragraphs',
                labels: { singular: 'Paragraph', plural: 'Paragraphs' },
                fields: [{ name: 'text', type: 'textarea', label: 'Text', required: true } as Field],
              } as Field,
            ],
          },
        ]
      : []),

    ...(featureCardsLabel
      ? [
          {
            name: 'features',
            label: featureCardsLabel,
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
                  // These cards are rendered with a pictogram, not a photo, so
                  // the icon takes the place cardArray's image would occupy.
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
                  ...(featureCardsFeatured
                    ? ([
                        {
                          name: 'featured',
                          type: 'checkbox',
                          label: 'Highlight this card',
                          admin: {
                            description:
                              'Outlines the card and adds the “Industry-leading standard” note.',
                          },
                        },
                      ] as Field[])
                    : []),
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
            label: imageCardsLabel,
            description: imageCardsHelp,
            fields: [
              ...sectionHeader(),
              cardArray({
                name: 'cards',
                label: imageCardsLabel,
                labelSingular: 'Card',
                withImage: true,
                withLink: true,
                extraFields: [
                  ...(showcaseBadgeLabel
                    ? ([{ name: 'badge', type: 'text', label: showcaseBadgeLabel }] as Field[])
                    : []),
                  ...(showcaseIcon ? [iconField()] : []),
                ],
              }),
              ...(showcaseStatsHelp
                ? [statArray({ label: 'Figures below the cards', description: showcaseStatsHelp })]
                : []),
            ],
          },
        ]
      : []),

    ...(chipsLabel
      ? [
          {
            name: 'services',
            label: chipsLabel,
            description: chipsHelp,
            fields: [
              ...sectionHeader(),
              chipArray({
                name: 'chips',
                label: chipsLabel,
                labelSingular: chipsSingular,
                extraFields: [iconField()],
              }),
            ],
          },
        ]
      : []),
  ]

  const tabs = [
    ...numbered.map((tab, index) => ({ ...tab, label: `${index + 1} · ${tab.label}` })),
    // Unnumbered on purpose — it always sits last, and "Closing band (bottom)"
    // already says where it is.
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
  ]

  return {
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
    fields: [{ type: 'tabs', tabs }],
  }
}
