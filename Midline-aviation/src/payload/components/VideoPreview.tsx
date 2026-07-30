'use client'

import { useField } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

/**
 * Plays the currently selected film underneath its upload control, so an
 * editor can confirm they picked the right clip before saving rather than
 * publishing and checking the live site.
 *
 * Appended via `admin.components.afterInput`, leaving Payload's own upload
 * control, label and error states untouched.
 *
 * The field holds a document ID, not a URL, so the file has to be fetched.
 * `fieldPath` arrives explicitly through clientProps rather than being inferred
 * from context — the context hook names have moved between Payload 3.x minors
 * and an explicit path is verifiable.
 */
export const VideoPreview = ({ fieldPath }: { fieldPath: string }) => {
  const { value } = useField<string | number | { id?: string | number; url?: string }>({
    path: fieldPath,
  })
  const [url, setUrl] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)

    if (!value) {
      setUrl(null)
      return
    }

    // Depending on depth, the field is either a populated document or a bare ID.
    if (typeof value === 'object' && typeof value.url === 'string') {
      setUrl(value.url)
      return
    }

    const id = typeof value === 'object' ? value.id : value
    if (!id) {
      setUrl(null)
      return
    }

    let cancelled = false
    fetch(`/payload-api/videos/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => {
        if (cancelled) return
        setUrl(typeof doc?.url === 'string' ? doc.url : null)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [value])

  if (!value) {
    return (
      <p style={{ marginTop: '.5rem', fontSize: '.8rem', opacity: 0.6 }}>
        No film selected — this section will show only its still image.
      </p>
    )
  }

  if (failed) {
    return (
      <p style={{ marginTop: '.5rem', fontSize: '.8rem', color: '#c00' }}>
        Couldn&apos;t load this film. Try re-selecting it.
      </p>
    )
  }

  if (!url) return null

  return (
    <video
      key={url}
      src={url}
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
    />
  )
}
