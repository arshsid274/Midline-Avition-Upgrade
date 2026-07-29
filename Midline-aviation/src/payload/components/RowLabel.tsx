'use client'

import { useRowLabel } from '@payloadcms/ui'

/**
 * Labels a collapsed array row with its own content.
 *
 * Without this, a list of nine destinations collapses to "Item 1 … Item 9" and
 * the editor has to open each one to find the card they meant to change.
 */
export const CardRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string; name?: string }>()
  const label = data?.title || data?.name
  return <span>{label || `Card ${(rowNumber ?? 0) + 1}`}</span>
}

export const StatRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ value?: string; label?: string }>()
  if (data?.value || data?.label) {
    return (
      <span>
        {data.value} — {data.label}
      </span>
    )
  }
  return <span>{`Number ${(rowNumber ?? 0) + 1}`}</span>
}

export const ContactRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ kind?: string; value?: string }>()
  if (data?.value) return <span>{data.value}</span>
  return <span>{`Detail ${(rowNumber ?? 0) + 1}`}</span>
}

export const FactRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ label?: string; value?: string }>()
  if (data?.label) return <span>{data.label}</span>
  return <span>{`Fact ${(rowNumber ?? 0) + 1}`}</span>
}
