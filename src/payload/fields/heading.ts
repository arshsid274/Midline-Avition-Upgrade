import type { Field } from 'payload'

/**
 * A site headline, split into the three parts the markup actually renders:
 * a first line, an accent phrase shown in Midline blue, and the rest.
 *
 * Why three fields instead of a rich-text editor:
 *
 *  - SplitHeading animates these with GSAP SplitText using a per-line mask.
 *    Rich text emits an arbitrary node tree, so an editor could drop a list or
 *    a nested heading inside the <h1> and silently break the reveal.
 *  - Rendering rich text would ship a converter into the client bundle.
 *  - Adding any richText field forces a root `editor` into payload.config.ts,
 *    changing the admin bundle for every collection already shipped.
 *  - "Words shown in Midline blue" is a self-documenting label in a way a
 *    colour button in a toolbar is not, and the line break becomes structure
 *    the editor cannot accidentally delete.
 *
 * Accepted limitation: the accent's position is fixed by the schema. If a page
 * ever needs the accent elsewhere, add an `accentPosition` select — not Lexical.
 */
export const headingField = ({
  name = 'heading',
  label = 'Headline',
  required = true,
  description,
}: {
  name?: string
  label?: string
  required?: boolean
  description?: string
} = {}): Field => ({
  name,
  type: 'group',
  label,
  admin: description ? { description } : undefined,
  fields: [
    {
      name: 'line1',
      type: 'text',
      label: 'First line',
      required,
    },
    {
      name: 'accent',
      type: 'text',
      label: 'Start of the second line',
      admin: {
        description:
          'Headings render in a single colour (client brief: no mixed-colour headlines). Leave empty for none.',
      },
    },
    {
      name: 'rest',
      type: 'text',
      label: 'Rest of the second line',
      admin: { description: 'Follows the start of the second line, same colour.' },
    },
  ],
})
