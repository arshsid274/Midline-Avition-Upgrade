import type { CollectionConfig } from 'payload'

import { revalidatePaths } from '../payload/hooks/revalidate'

/**
 * Industry credentials shown in the home-page marquee and on /safety.
 * Replaces the hand-maintained ACCREDITATIONS array in src/lib/accreditations.ts.
 *
 * `name` doubles as alt text, exactly as it did before — the marks are logos, so
 * the organisation's full name is the correct description.
 *
 * `enabled` preserves the original launch-toggle behaviour: unverified
 * credentials sit here switched off and ops turns them on once the certificate
 * arrives. That used to require a code change and deploy; now it is a checkbox.
 */
export const Accreditations: CollectionConfig = {
  slug: 'accreditations',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'shortName',
    defaultColumns: ['shortName', 'kind', 'enabled', 'order'],
    description:
      'Logos in the home-page marquee and the /safety memberships list. Untick "enabled" to hide one without deleting it.',
  },
  defaultSort: 'order',
  hooks: {
    afterChange: [revalidatePaths(['/', '/safety'])],
    afterDelete: [revalidatePaths(['/', '/safety'])],
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Stable identifier (e.g. "nbaa"). Used by the seed script — avoid changing.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description:
          'Full organisation name. Also used as the image alt text, so write it as you would describe the logo.',
      },
    },
    {
      name: 'shortName',
      type: 'text',
      required: true,
      admin: { description: 'Abbreviation used in the /safety list, e.g. "NBAA".' },
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'membership',
      options: [
        { label: 'Rating', value: 'rating' },
        { label: 'Membership', value: 'membership' },
        { label: 'Authority', value: 'authority' },
      ],
      admin: { description: 'Only "membership" entries appear on /safety.' },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Off until the certificate is verified. Hidden everywhere while off.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Internal only — never rendered on the site.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
