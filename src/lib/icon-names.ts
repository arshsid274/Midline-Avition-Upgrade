/**
 * The icons an editor can choose for a feature card.
 *
 * Deliberately free of imports. Two things need this list and they must not
 * drift apart: the Payload select field (which runs in the admin bundle) and
 * the icon registry in icons.ts (which pulls in lucide-react). Importing the
 * registry into the Payload config would drag every icon component into the
 * admin bundle for the sake of a handful of strings.
 *
 * The values are stable slugs, not lucide export names. Renaming a lucide icon
 * upstream then changes one line in icons.ts rather than invalidating content
 * already saved in the database.
 *
 * To add an icon: add it here, then add the matching component in icons.ts —
 * that file types its map as Record<IconName, …>, so forgetting the second
 * half is a compile error rather than a blank space on the page.
 */
export const ICON_NAMES = [
  'calendar-clock',
  'sofa',
  'shield-check',
  'concierge-bell',
  'globe',
  'globe-2',
  'line-chart',
  'shield',
  'wallet',
  'wrench',
  'check-circle',
  'sliders',
  'arrow-up-right',
  'search',
  'handshake',
  'plane',
  'badge-check',
  'sparkles',
  'banknote',
  'clipboard-check',
  'file-search',
  'cog',
  'shield-alert',
] as const

export type IconName = (typeof ICON_NAMES)[number]

/** Labels written for someone choosing an icon, not someone who knows lucide. */
export const ICON_OPTIONS: { label: string; value: IconName }[] = [
  { label: 'Calendar / scheduling', value: 'calendar-clock' },
  { label: 'Seat / comfort', value: 'sofa' },
  { label: 'Shield with tick / safety', value: 'shield-check' },
  { label: 'Concierge bell / service', value: 'concierge-bell' },
  { label: 'Globe / worldwide', value: 'globe' },
  { label: 'Globe, alternate', value: 'globe-2' },
  { label: 'Chart / performance', value: 'line-chart' },
  { label: 'Shield / protection', value: 'shield' },
  { label: 'Wallet / cost', value: 'wallet' },
  { label: 'Spanner / maintenance', value: 'wrench' },
  { label: 'Tick in a circle / approved', value: 'check-circle' },
  { label: 'Sliders / bespoke', value: 'sliders' },
  { label: 'Arrow / link', value: 'arrow-up-right' },
  { label: 'Magnifier / search', value: 'search' },
  { label: 'Handshake / agreement', value: 'handshake' },
  { label: 'Aeroplane', value: 'plane' },
  { label: 'Badge with tick / certified', value: 'badge-check' },
  { label: 'Sparkles / marketing', value: 'sparkles' },
  { label: 'Banknote / financing', value: 'banknote' },
  { label: 'Clipboard with tick / inspection', value: 'clipboard-check' },
  { label: 'Document with magnifier / research', value: 'file-search' },
  { label: 'Cog / repair', value: 'cog' },
  { label: 'Shield with alert / overhaul', value: 'shield-alert' },
]
