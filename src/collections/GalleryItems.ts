import type { CollectionConfig } from 'payload'

import { revalidatePaths } from '../payload/hooks/revalidate'
import { videoField } from '../payload/fields/video'

/**
 * The gallery grid — photos and films in one ordered list.
 *
 * A collection rather than an array on a page global: it is 75 entries and
 * grows every time the company shoots something, which is exactly the case
 * where a list view with filtering beats a single enormous form.
 *
 * Videos stay static files on R2 and are referenced by path, with a player
 * shown beside the field. Photos are uploads. `kind` decides which of the two
 * a row uses — the old code inferred it from whether a poster existed, which
 * was invisible to anyone reading the data.
 */
export const GalleryItems: CollectionConfig = {
  slug: 'gallery-items',
  access: { read: () => true },
  admin: {
    group: 'Content Library',
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'kind', 'category', 'order'],
    description: 'Everything in the gallery grid. Drag the order number to rearrange.',
  },
  defaultSort: 'order',
  hooks: {
    afterChange: [revalidatePaths(['/gallery'])],
    afterDelete: [revalidatePaths(['/gallery'])],
  },
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'image',
      options: [
        { label: 'Photo', value: 'image' },
        { label: 'Film', value: 'video' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Photo',
      admin: { condition: (data) => data?.kind === 'image' },
    },
    videoField({
      name: 'videoUrl',
      label: 'Film',
      description: 'Path such as /assets/videos/gallery/name.mp4.',
    }),
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: 'Film still',
      admin: {
        condition: (data) => data?.kind === 'video',
        description: 'The frame shown before the film plays.',
      },
    },
    { name: 'caption', type: 'text', required: true, label: 'Caption' },
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Description for screen readers',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Gulfstream G450', value: 'Gulfstream G450' },
        { label: 'Gulfstream G200', value: 'Gulfstream G200' },
        { label: 'Embraer Legacy 650', value: 'Embraer Legacy 650' },
        { label: 'Services', value: 'Services' },
      ],
      admin: {
        position: 'sidebar',
        description: 'The filter buttons. "All" and "Videos" are automatic.',
      },
    },
    {
      name: 'orientation',
      type: 'select',
      required: true,
      defaultValue: 'landscape',
      options: [
        { label: 'Landscape', value: 'landscape' },
        { label: 'Portrait', value: 'portrait' },
      ],
      admin: { position: 'sidebar', description: 'Controls the tile shape in the grid.' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
