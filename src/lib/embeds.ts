/**
 * Understands a pasted link — YouTube, Vimeo, or a direct image URL — and works
 * out what to show for it.
 *
 * Deliberately dependency-free and free of any Node or browser API beyond the
 * standard `URL`, because the same function runs in three places that cannot
 * share much else: the admin preview (client), the gallery mapper (server), and
 * the seed scripts (plain Node). One parser means the editor's preview and the
 * published tile can never disagree about what a link points at.
 *
 * Thumbnails are derived from the URL rather than fetched. YouTube exposes a
 * predictable still at i.ytimg.com, so no API key and no network call is needed.
 * Vimeo does not, which is why a Vimeo link asks for a film still to be uploaded
 * — see `needsPoster`.
 */

export type EmbedProvider = 'youtube' | 'vimeo' | 'image'

export type ParsedEmbed = {
  provider: EmbedProvider
  /** 'video' opens a player; 'photo' opens the picture. */
  kind: 'video' | 'photo'
  /** The page a visitor would call the source, e.g. a YouTube watch page. */
  watchUrl: string
  /** Thumbnail for the grid tile, or null when one must be uploaded instead. */
  thumbnailUrl: string | null
  /** Bare hostname for crediting the source, e.g. "youtube.com". */
  host: string
  /** True when no thumbnail can be derived and a film still must be uploaded. */
  needsPoster: boolean
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg']

/** youtu.be/ID, /watch?v=ID, /shorts/ID, /embed/ID, /live/ID — all seen in the wild. */
const youtubeId = (url: URL): string | null => {
  const host = url.hostname.replace(/^www\./, '')

  if (host === 'youtu.be') {
    const id = url.pathname.slice(1).split('/')[0]
    return id || null
  }

  if (host !== 'youtube.com' && host !== 'm.youtube.com' && host !== 'youtube-nocookie.com') {
    return null
  }

  const fromQuery = url.searchParams.get('v')
  if (fromQuery) return fromQuery

  const [, section, id] = url.pathname.split('/')
  if ((section === 'shorts' || section === 'embed' || section === 'live') && id) return id

  return null
}

/** vimeo.com/ID, vimeo.com/channels/<name>/ID, player.vimeo.com/video/ID. */
const vimeoId = (url: URL): string | null => {
  const host = url.hostname.replace(/^www\./, '')
  if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null

  // The ID is the last all-digits segment, which holds for every shape above.
  const segments = url.pathname.split('/').filter(Boolean)
  for (let i = segments.length - 1; i >= 0; i -= 1) {
    if (/^\d+$/.test(segments[i])) return segments[i]
  }
  return null
}

const looksLikeImage = (url: URL): boolean => {
  const path = url.pathname.toLowerCase()
  return IMAGE_EXTENSIONS.some((extension) => path.endsWith(extension))
}

/**
 * Returns null for anything unrecognised — the caller decides whether that is a
 * validation error (the collection) or a row to skip (the mapper).
 */
export const parseEmbed = (input: unknown): ParsedEmbed | null => {
  if (typeof input !== 'string' || !input.trim()) return null

  let url: URL
  try {
    url = new URL(input.trim())
  } catch {
    return null
  }

  // Only http(s). A javascript: or data: URL reaching an href or an <img src>
  // is a script-injection vector, and the admin field is editor-supplied.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null

  const host = url.hostname.replace(/^www\./, '')

  const youtube = youtubeId(url)
  if (youtube) {
    return {
      provider: 'youtube',
      kind: 'video',
      watchUrl: `https://www.youtube.com/watch?v=${youtube}`,
      // hqdefault exists for every video; maxresdefault does not and 404s.
      thumbnailUrl: `https://i.ytimg.com/vi/${youtube}/hqdefault.jpg`,
      host: 'youtube.com',
      needsPoster: false,
    }
  }

  const vimeo = vimeoId(url)
  if (vimeo) {
    return {
      provider: 'vimeo',
      kind: 'video',
      watchUrl: `https://vimeo.com/${vimeo}`,
      // Vimeo stills live behind an API call, so the editor uploads one instead.
      thumbnailUrl: null,
      host: 'vimeo.com',
      needsPoster: true,
    }
  }

  if (looksLikeImage(url)) {
    return {
      provider: 'image',
      kind: 'photo',
      watchUrl: url.href,
      thumbnailUrl: url.href,
      host,
      needsPoster: false,
    }
  }

  return null
}

/** The player URL for an <iframe>, used by the admin preview. */
export const embedIframeUrl = (parsed: ParsedEmbed): string | null => {
  if (parsed.provider === 'youtube') {
    const id = new URL(parsed.watchUrl).searchParams.get('v')
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  if (parsed.provider === 'vimeo') {
    const id = parsed.watchUrl.split('/').pop()
    return id ? `https://player.vimeo.com/video/${id}` : null
  }
  return null
}

/** Message shown when a link is not one of the supported shapes. */
export const EMBED_HELP =
  'Paste a YouTube link (youtube.com/watch, youtu.be, or a Short), a Vimeo link, or a direct image address ending in .jpg, .png, .webp, .gif or .avif.'
