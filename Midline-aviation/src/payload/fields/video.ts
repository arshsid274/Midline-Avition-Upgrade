import type { Field } from 'payload'

/**
 * A background or showcase film.
 *
 * This is an upload relationship to the Videos collection, so an editor can
 * either pick an existing film or upload a new file and have it replace the
 * old one everywhere that film is used.
 *
 * It was previously a plain text path with a preview player attached. That let
 * someone re-point a section at a film that already existed but gave no way to
 * add one, which is the thing people actually want to do. Payload's upload
 * control shows the current file, its size, and a Choose/Upload button.
 */
export const videoField = ({
  name = 'video',
  label = 'Film',
  required = false,
  description,
}: {
  name?: string
  label?: string
  required?: boolean
  description?: string
} = {}): Field => ({
  name,
  type: 'upload',
  relationTo: 'videos',
  label,
  required,
  admin: {
    description:
      description ??
      'Plays muted on a loop, with no sound. Upload a new file to replace it, or choose one already in the library.',
    components: {
      afterInput: [
        {
          path: '@/payload/components/VideoPreview#VideoPreview',
          clientProps: { fieldPath: name },
        },
      ],
    },
  },
})
