import type { Field } from 'payload'

import { ICON_OPTIONS } from '@/lib/icon-names'

/**
 * The small pictogram shown above a feature card's title.
 *
 * A select rather than free text: the value has to resolve to a real component
 * in src/lib/icons.ts, and a typo in a text field would silently render the
 * fallback. A select also gives the editor a list to choose from instead of
 * requiring them to know lucide's naming.
 *
 * Not required. Drafts skip required-field validation anyway, so components
 * must tolerate a missing icon regardless — iconFor() handles that — and
 * making it required would only block saving a half-finished card.
 */
export const iconField = ({
  name = 'icon',
  label = 'Icon',
  description = 'The small symbol above the title.',
}: {
  name?: string
  label?: string
  description?: string
} = {}): Field => ({
  name,
  type: 'select',
  label,
  options: ICON_OPTIONS,
  admin: { description },
})
