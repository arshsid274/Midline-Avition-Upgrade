import type { Field } from 'payload'

/**
 * A background or showcase video.
 *
 * Videos are static files on Cloudflare R2, not Payload uploads — they are
 * large, they change rarely, and pushing a 50 MB file through the admin panel
 * is a poor experience. So this is a plain text path with a preview player
 * appended beneath the input, letting the editor confirm they picked the right
 * clip without leaving the page.
 *
 * `afterInput` rather than a custom Field component: this way Payload still
 * renders the label, description, validation and error states itself, instead
 * of us reimplementing all of that.
 */
export const videoField = ({
  name = 'videoUrl',
  label = 'Video',
  required = false,
  description,
}: {
  name?: string
  label?: string
  required?: boolean
  description?: string
} = {}): Field => ({
  name,
  type: 'text',
  label,
  required,
  admin: {
    description:
      description ??
      'Plays muted on a loop, with no sound. Path such as /assets/videos/g200-showcase.mp4.',
    components: {
      afterInput: [
        {
          path: '@/payload/components/VideoPreview#VideoPreview',
          clientProps: { fieldPath: name },
        },
      ],
    },
  },
  validate: (value: unknown) => {
    if (!value) return required ? 'Choose a video.' : true
    if (typeof value !== 'string') return 'Must be text.'
    const ok = value.startsWith('https://') || value.startsWith('/assets/videos/')
    return ok
      ? true
      : 'Use a path starting /assets/videos/ or a full https:// address. A typo here leaves the section black.'
  },
})
