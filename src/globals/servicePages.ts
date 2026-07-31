import { makeServicePage } from './servicePage'

/**
 * The five service pages. Each names its own blocks so the tabs match the
 * page an editor is actually looking at.
 */
export const CharterPage = makeServicePage({
  slug: 'charter-page',
  label: 'Services · Aircraft Charter',
  path: '/services/aircraft-charter',
  featureCardsLabel: 'Why choose us',
  featureCardsHelp: 'The row of reasons with icons.',
  imageCardsLabel: 'Bespoke travel categories',
  imageCardsHelp: 'The three tall picture cards.',
  // The charter page renders no closing band, so the tab is removed rather than
  // left in place. A control that looks editable and changes nothing is worse
  // than an absent one — someone types into it and waits for a result.
  withClosing: false,
})

export const ManagementPage = makeServicePage({
  slug: 'management-page',
  label: 'Services · Aircraft Management',
  path: '/services/aircraft-management',
  featureCardsLabel: 'Operational core',
  featureCardsHelp: 'The three cards with bullet points.',
  imageCardsLabel: 'Our management fleet',
  imageCardsHelp: 'The three aircraft cards.',
  withClosing: false,
})

export const SalesPage = makeServicePage({
  slug: 'sales-page',
  label: 'Services · Aircraft Sales',
  path: '/services/aircraft-sales',
  imageCardsLabel: 'Advisory blocks',
  imageCardsHelp: 'The alternating picture-and-text blocks.',
})

export const CargoPage = makeServicePage({
  slug: 'cargo-page',
  label: 'Services · Cargo Transportation',
  path: '/services/cargo-transportation',
  featureCardsLabel: 'Why choose Midline Cargo',
  featureCardsHelp: 'The three cards with bullet points.',
  imageCardsLabel: 'Our operations',
  imageCardsHelp: 'The three picture cards and the figures below them.',
  withStats: true,
  withClosing: false,
})

export const MroPage = makeServicePage({
  slug: 'mro-page',
  label: 'Services · MRO',
  path: '/services/mro',
  featureCardsLabel: 'Capabilities',
  featureCardsHelp: 'The three tiles describing what the facility will offer.',
  withClosing: false,
})
