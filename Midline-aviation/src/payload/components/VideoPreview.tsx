'use client'

import { useField } from '@payloadcms/ui'

/**
 * Renders the current video underneath its path field so an editor can see
 * what they have selected. Appended via `admin.components.afterInput`, so
 * Payload's own label, description and error rendering are untouched.
 *
 * `fieldPath` is passed explicitly through clientProps rather than inferred
 * from context: the context hook names have moved between Payload 3.x minors,
 * and an explicit path is verifiable.
 */
export const VideoPreview = ({ fieldPath }: { fieldPath: string }) => {
  const { value } = useField<string>({ path: fieldPath })

  if (!value) {
    return (
      <p style={{ marginTop: '.5rem', fontSize: '.8rem', opacity: 0.6 }}>
        No video set — this section will show only its poster image.
      </p>
    )
  }

  return (
    <video
      key={value}
      src={value}
      controls
      muted
      playsInline
      preload="metadata"
      style={{
        marginTop: '.5rem',
        width: '100%',
        maxWidth: 360,
        borderRadius: 4,
        background: '#000',
      }}
      onError={(event) => {
        const el = event.currentTarget
        el.insertAdjacentHTML(
          'afterend',
          `<p style="margin-top:.5rem;font-size:.8rem;color:#c00">Couldn't load this video — check the path.</p>`
        )
        el.style.display = 'none'
      }}
    />
  )
}
