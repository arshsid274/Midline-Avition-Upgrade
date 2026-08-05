/**
 * Thumbnails for the Videos collection.
 *
 * Payload's admin can only thumbnail images — sharp cannot read video — so
 * every film shows as the same generic file icon and an editor cannot tell
 * one clip from another without opening each. These components render the
 * film itself in a <video> element instead: `preload="metadata"` plus a
 * `#t=0.1` media fragment makes the browser fetch just enough of the file to
 * paint a first frame, which acts as the thumbnail. No poster images to
 * generate or keep in sync, and it works identically whether the file lives
 * on UploadThing (Vercel) or local disk (cPanel) — both serve range requests.
 *
 * Server components: nothing here needs interactivity beyond the browser's
 * native video controls.
 */

type FieldProps = {
  data?: Record<string, unknown>
}

type CellProps = {
  rowData?: Record<string, unknown>
}

const urlFrom = (doc: Record<string, unknown> | undefined): string | null => {
  const url = doc?.url
  return typeof url === 'string' && url.length > 0 ? url : null
}

/** List view: a small first-frame still for each row. */
export const VideoThumbCell = (props: CellProps) => {
  const url = urlFrom(props.rowData)
  if (!url) return <span style={{ opacity: 0.5 }}>No file</span>

  return (
    <video
      muted
      playsInline
      preload="metadata"
      src={`${url}#t=0.1`}
      style={{
        width: 96,
        height: 54,
        objectFit: 'cover',
        borderRadius: 4,
        background: '#000',
        display: 'block',
      }}
    />
  )
}

/** Edit view: the film itself, playable, above the fields. */
export const VideoPreviewField = (props: FieldProps) => {
  const url = urlFrom(props.data)
  // Create view — no file uploaded yet, nothing to preview.
  if (!url) return null

  return (
    <div style={{ marginBottom: 'calc(var(--base, 20px) * 1.2)' }}>
      <video
        controls
        muted
        playsInline
        preload="metadata"
        src={`${url}#t=0.1`}
        style={{
          width: '100%',
          maxWidth: 480,
          borderRadius: 4,
          background: '#000',
          display: 'block',
        }}
      />
      <p style={{ fontSize: '.75rem', opacity: 0.55, marginTop: '.4rem' }}>
        This is the film currently stored in this entry. Uploading a new file replaces it
        everywhere it is used.
      </p>
    </div>
  )
}
