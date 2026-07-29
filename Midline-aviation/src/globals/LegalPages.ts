import type { GlobalConfig } from 'payload'

import { revalidateGlobalPublished } from '../payload/hooks/revalidate'

/**
 * Privacy, Terms and Cookies.
 *
 * Only the title and the "last updated" date are editable here. The body of
 * each document stays in code on purpose: it is legal text requiring sign-off,
 * and in the repository every change carries an author, a date and a reviewable
 * diff — none of which a CMS field provides. The date is the part that actually
 * changes, and forgetting to update it after a legal revision is the mistake
 * this prevents.
 *
 * If legal ever wants to draft directly, this is where a rich-text field goes,
 * with its feature list locked to headings, lists and links.
 */
const legalTab = (name: string, label: string, path: string) => ({
  name,
  label,
  description: `Shown at ${path}. The wording of the document itself is maintained in the codebase.`,
  fields: [
    { name: 'title', type: 'text' as const, label: 'Page title', required: true },
    {
      name: 'updated',
      type: 'text' as const,
      label: 'Last updated',
      required: true,
      admin: {
        description: 'Shown as "Last updated: …". Change this whenever legal revises the wording.',
      },
    },
    {
      name: 'note',
      type: 'ui' as const,
      admin: { components: { Field: '@/payload/components/SectionNote#LegalNote' } },
    },
  ],
})

export const LegalPages: GlobalConfig = {
  slug: 'legal-pages',
  label: 'Legal Pages',
  access: { read: () => true },
  admin: {
    group: 'Pages',
    description: 'Titles and revision dates for the privacy, terms and cookie documents.',
  },
  versions: { drafts: { autosave: { interval: 1500 } }, max: 20 },
  hooks: {
    afterChange: [
      revalidateGlobalPublished(['/privacy-policy', '/terms-and-conditions', '/cookie-policy']),
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        legalTab('privacy', 'Privacy Policy', '/privacy-policy'),
        legalTab('terms', 'Terms & Conditions', '/terms-and-conditions'),
        legalTab('cookies', 'Cookie Policy', '/cookie-policy'),
      ],
    },
  ],
}
