import type { CollectionConfig } from 'payload'

import { revalidatePaths } from '../payload/hooks/revalidate'
import { videoField } from '../payload/fields/video'
import { EMBED_HELP, parseEmbed } from '../lib/embeds'

/**
 * The gallery grid — photos and films in one ordered list.
 *
 * A collection rather than an array on a page global: it is 75 entries and
 * grows every time the company shoots something, which is exactly the case
 * where a list view with filtering beats a single enormous form.
 *
 * Videos stay static files on R2 and are referenced by path, with a player
 * shown beside the field. Photos are uploads. `kind` decides which of the three
 * a row uses — the old code inferred it from whether a poster existed, which
 * was invisible to anyone reading the data.
 *
 * The third kind is a pasted link — a YouTube or Vimeo film, or a photo hosted
 * elsewhere. Nothing is copied onto our storage: the tile shows the source's own
 * still and names the site it comes from, and the lightbox plays it in place.
 * That keeps a marketing clip that already lives on the company's YouTube
 * channel out of the 2 GB upload tier, and means a film can go in the gallery
 * without waiting on a 50 MB upload.
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
        { label: 'Link (YouTube, Vimeo, or a photo URL)', value: 'link' },
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
      name: 'embedUrl',
      type: 'text',
      label: 'Link',
      admin: {
        condition: (data) => data?.kind === 'link',
        description: EMBED_HELP,
        components: {
          // Plays the link as it is pasted and names the site it comes from.
          afterInput: [
            {
              path: '@/payload/components/EmbedPreview#EmbedPreview',
              clientProps: { fieldPath: 'embedUrl' },
            },
          ],
        },
      },
      /**
       * Rejected at save rather than skipped at render. A link the gallery
       * cannot read would otherwise save cleanly, disappear from the page, and
       * give the editor nothing to act on.
       */
      validate: (value: unknown, { siblingData }: { siblingData?: { kind?: string } }) => {
        if (siblingData?.kind !== 'link') return true
        if (!value) return 'Paste a link. ' + EMBED_HELP
        return parseEmbed(value) ? true : EMBED_HELP
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: 'Film still',
      admin: {
        condition: (data) => data?.kind === 'video' || data?.kind === 'link',
        description:
          'The frame shown before the film plays. Optional for a YouTube link — its own still is used when this is empty — but required for Vimeo, which does not publish one.',
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
