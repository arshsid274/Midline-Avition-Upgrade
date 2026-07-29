import type { CollectionConfig } from 'payload'

/**
 * Admin accounts. Payload protects /admin with this collection out of the box.
 *
 * Access is deliberately left at Payload's defaults (authenticated-only for
 * every operation) — unlike the content collections, nothing here should ever
 * be world-readable. New editors are created from inside the admin panel;
 * public self-registration is never enabled.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: { description: 'Shown in the admin panel so edits are attributable.' },
    },
  ],
}
