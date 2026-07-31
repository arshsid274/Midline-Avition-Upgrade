import { makeServicePage } from './servicePage'

/**
 * The five service pages. Each names only the blocks it actually renders, so
 * every tab an editor sees corresponds to something on screen — and every
 * section on screen has a tab.
 */
export const CharterPage = makeServicePage({
  slug: 'charter-page',
  label: 'Services · Aircraft Charter',
  path: '/services/aircraft-charter',
  featureCardsLabel: 'Why choose us',
  featureCardsHelp: 'The row of reasons with icons.',
  imageCardsLabel: 'Bespoke travel categories',
  imageCardsHelp: 'The three tall picture cards.',
  // No closing band on this page.
  withClosing: false,
})

export const ManagementPage = makeServicePage({
  slug: 'management-page',
  label: 'Services · Aircraft Management',
  path: '/services/aircraft-management',
  standardsLabel: 'The Midline advantage',
  standardsHelp: 'The band with two points, a tall picture, and the figure over it.',
  featureCardsLabel: 'Operational core',
  featureCardsHelp: 'The three cards with bullet points.',
  imageCardsLabel: 'Our management fleet',
  imageCardsHelp: 'The three aircraft cards.',
  showcaseBadgeLabel: 'Badge over the picture, e.g. “Large Jet”',
  withClosing: false,
})

export const SalesPage = makeServicePage({
  slug: 'sales-page',
  label: 'Services · Aircraft Sales',
  path: '/services/aircraft-sales',
  introLabel: 'Market guidance',
  introHelp: 'The two-column band of text under the header.',
  imageCardsLabel: 'Advisory blocks',
  imageCardsHelp: 'The alternating picture-and-text blocks.',
  showcaseBadgeLabel: 'Small line above the title',
  showcaseIcon: true,
  chipsLabel: 'Comprehensive services',
  chipsHelp: 'The grid of service names with icons.',
  chipsSingular: 'Service',
})

export const CargoPage = makeServicePage({
  slug: 'cargo-page',
  label: 'Services · Cargo Transportation',
  path: '/services/cargo-transportation',
  withStats: true,
  featureCardsLabel: 'Why choose Midline Cargo',
  featureCardsHelp: 'The three cards with bullet points.',
  featureCardsFeatured: true,
  imageCardsLabel: 'Our operations',
  imageCardsHelp: 'The three picture cards and the figures below them.',
  showcaseBadgeLabel: 'Tag over the picture, e.g. “Priority Freight”',
  showcaseStatsHelp: 'The four figures under the cards.',
  withClosing: false,
})

export const MroPage = makeServicePage({
  slug: 'mro-page',
  label: 'Services · MRO',
  path: '/services/mro',
  heroExtras: true,
  featureCardsLabel: 'Capabilities',
  featureCardsHelp: 'The three tiles describing what the facility will offer.',
  withClosing: false,
})
