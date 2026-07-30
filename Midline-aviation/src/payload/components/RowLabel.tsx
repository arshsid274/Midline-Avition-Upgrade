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

export const GroupRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ heading?: string; questions?: unknown[] }>()
  if (data?.heading) {
    const count = data.questions?.length ?? 0
    return <span>{`${data.heading} (${count})`}</span>
  }
  return <span>{`Group ${(rowNumber ?? 0) + 1}`}</span>
}

export const QuestionRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ q?: string }>()
  return <span>{data?.q || `Question ${(rowNumber ?? 0) + 1}`}</span>
}

export const PersonRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ name?: string; title?: string }>()
  if (data?.name) return <span>{data.title ? `${data.name} — ${data.title}` : data.name}</span>
  return <span>{`Person ${(rowNumber ?? 0) + 1}`}</span>
}

export const SpecRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ label?: string; value?: number; unit?: string }>()
  if (data?.label) return <span>{`${data.label} — ${data.value ?? ''}${data.unit ?? ''}`}</span>
  return <span>{`Figure ${(rowNumber ?? 0) + 1}`}</span>
}

export const GalleryRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ span?: string }>()
  return <span>{`Photo ${(rowNumber ?? 0) + 1}${data?.span && data.span !== 'standard' ? ` (${data.span})` : ''}`}</span>
}
