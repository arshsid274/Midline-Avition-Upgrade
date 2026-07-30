import type { Field } from 'payload'

/**
 * A button or link: its visible label and where it goes, presented on one row
 * so the pair reads as a single thing in the admin.
 *
 * The validator catches the two mistakes that actually happen — a bare word
 * with no slash, and an internal path missing its leading slash — both of
 * which produce a link that silently 404s or resolves relative to the current
 * page. Two heroes on the site currently ship buttons with no destination at
 * all; requiring href here stops that recurring.
 */
export const linkField = ({
  name = 'cta',
  label = 'Button',
  required = false,
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
      type: 'row',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Button text',
          required,
          admin: { width: '50%' },
        },
        {
          name: 'href',
          type: 'text',
          label: 'Goes to',
          required,
          admin: {
            width: '50%',
            description: 'e.g. /contact, /#book-your-flight, or a full https:// address.',
          },
          validate: (value: unknown) => {
            if (!value) return required ? 'Add a destination for this button.' : true
            if (typeof value !== 'string') return 'Must be text.'
            const ok =
              value.startsWith('/') ||
              value.startsWith('https://') ||
              value.startsWith('mailto:') ||
              value.startsWith('tel:')
            return ok
              ? true
              : 'Start with / for a page on this site, or https:// for an external link.'
          },
        },
      ],
    },
  ],
})
