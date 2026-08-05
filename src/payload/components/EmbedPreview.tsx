'use client'

import { useField } from '@payloadcms/ui'

import { EMBED_HELP, embedIframeUrl, parseEmbed } from '@/lib/embeds'

/**
 * Plays the pasted link underneath the field, and names where it comes from.
 *
 * Appended with `admin.components.afterInput`, so Payload's own input, label and
 * error states are untouched. It re-reads the field on every keystroke, which is
 * the point: the editor sees the actual video or photo appear as they paste,
 * rather than saving and checking the live site.
 *
 * Uses the same parser the gallery mapper uses, so what is previewed here is
 * exactly what the published page will show.
 */
export const EmbedPreview = ({ fieldPath }: { fieldPath: string }) => {
  const { value } = useField<string>({ path: fieldPath })
  const parsed = parseEmbed(value)

  if (!value) {
    return (
      <p style={{ marginTop: '.5rem', fontSize: '.8rem', opacity: 0.6 }}>{EMBED_HELP}</p>
    )
  }

  if (!parsed) {
    return (
      <p style={{ marginTop: '.5rem', fontSize: '.8rem', color: '#c00' }}>
        Not a link this gallery can show. {EMBED_HELP}
      </p>
    )
  }

  const iframe = embedIframeUrl(parsed)

  return (
    <div style={{ marginTop: '.6rem' }}>
      {iframe ? (
        <iframe
          key={iframe}
          src={iframe}
          title="Preview of the linked film"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width: '100%',
            maxWidth: 480,
            aspectRatio: '16 / 9',
            border: 0,
            borderRadius: 4,
            background: '#000',
            display: 'block',
          }}
        />
      ) : (
        // An arbitrary editor-supplied host cannot be in next.config's
        // remotePatterns, and next/image returns 400 for hosts it does not
        // know — a broken picture with nothing in the logs.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={parsed.thumbnailUrl ?? parsed.watchUrl}
          src={parsed.thumbnailUrl ?? parsed.watchUrl}
          alt="Preview of the linked photo"
          style={{
            width: '100%',
            maxWidth: 480,
            borderRadius: 4,
            background: '#f2f2f2',
            display: 'block',
          }}
        />
      )}

      <p style={{ fontSize: '.78rem', marginTop: '.45rem', lineHeight: 1.6 }}>
        <span style={{ opacity: 0.6 }}>Showing from </span>
        <strong>{parsed.host}</strong>
        <br />
        <a
          href={parsed.watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline', wordBreak: 'break-all', opacity: 0.85 }}
        >
          {parsed.watchUrl}
        </a>
      </p>

      {parsed.needsPoster && (
        <p style={{ fontSize: '.78rem', marginTop: '.35rem', opacity: 0.75 }}>
          Vimeo does not publish a still, so upload a “Film still” below — without one this
          entry is left out of the gallery.
        </p>
      )}
    </div>
  )
}
