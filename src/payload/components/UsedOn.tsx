import type { Payload } from 'payload'

import { getUsageFor } from '../usage/buildUsageIndex'

/**
 * "Used on" — shows every place a photo or film appears on the published site,
 * with a link to the admin document using it, so an editor understands what a
 * replacement will affect before uploading over it.
 *
 * Server components on purpose: the lookup walks every global and collection
 * through the local API, which only exists on the server. Payload renders
 * these via the import map, passing the document (`id`, `data`) to the Field
 * and the row (`rowData`) to the Cell.
 */

type FieldProps = {
  payload: Payload
  collectionSlug?: string
  id?: number | string
}

type CellProps = {
  payload: Payload
  collectionSlug: string
  rowData?: Record<string, unknown>
}

const asUploadCollection = (slug: unknown): 'media' | 'videos' | null =>
  slug === 'media' || slug === 'videos' ? slug : null

/** Edit view: a list of linked locations under the file preview. */
export const UsedOnField = async (props: FieldProps) => {
  const collection = asUploadCollection(props.collectionSlug)
  const { id } = props
  if (!collection || id === undefined || id === null) return null

  const locations = await getUsageFor(props.payload, collection, id)

  return (
    <div style={{ marginBottom: 'calc(var(--base, 20px) * 1.2)' }}>
      <div
        style={{
          fontSize: '.85rem',
          fontWeight: 600,
          marginBottom: '.4rem',
        }}
      >
        Used on
      </div>
      {locations.length === 0 ? (
        <p style={{ fontSize: '.85rem', opacity: 0.65, margin: 0 }}>
          Not used anywhere on the published site. Replacing or deleting this file changes
          nothing until something links to it.
        </p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '.85rem', lineHeight: 1.9 }}>
          {locations.map((location) => (
            <li key={`${location.href}-${location.label}`}>
              <a href={location.href} style={{ textDecoration: 'underline' }}>
                {location.label}
              </a>
            </li>
          ))}
        </ul>
      )}
      <p style={{ fontSize: '.75rem', opacity: 0.55, marginTop: '.4rem' }}>
        Uploading a new file over this entry replaces it in every location above.
      </p>
    </div>
  )
}

/**
 * List view: the same information compressed to one line per row. The full
 * scan runs once per page load — getUsageIndex is request-cached — so thirty
 * rows cost the same as one.
 */
export const UsedOnCell = async (props: CellProps) => {
  const collection = asUploadCollection(props.collectionSlug)
  const id = props.rowData?.id
  if (!collection || (typeof id !== 'number' && typeof id !== 'string')) return null

  const locations = await getUsageFor(props.payload, collection, id)

  if (locations.length === 0) {
    return <span style={{ opacity: 0.5 }}>Not used</span>
  }

  const [first, ...rest] = locations
  return (
    <span title={locations.map((l) => l.label).join('\n')}>
      {first.label}
      {rest.length > 0 ? ` (+${rest.length} more)` : ''}
    </span>
  )
}
