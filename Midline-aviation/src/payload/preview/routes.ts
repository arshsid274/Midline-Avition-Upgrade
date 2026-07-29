/**
 * The one place that knows which CMS entry maps to which URL.
 *
 * This single module feeds the live-preview iframe URL, the global's Preview
 * button, the preview route handler's allow-list, and the revalidation hooks.
 * Adding a page to the CMS means adding one line here.
 */
export const GLOBAL_ROUTES: Record<string, string> = {
  'home-page': '/',
  'contact-page': '/contact',
  'safety-page': '/safety',
}

/**
 * Paths the preview handler is willing to redirect to. Without this an
 * attacker could pass ?path=https://evil.example and turn the handler into an
 * open redirect. It costs nothing because the mapping already exists.
 */
export const PREVIEWABLE_PATHS = new Set(Object.values(GLOBAL_ROUTES))

const serverURL = () =>
  process.env.NEXT_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const buildPreviewURL = (path: string) => {
  const params = new URLSearchParams({
    secret: process.env.PREVIEW_SECRET ?? '',
    path,
  })
  return `${serverURL()}/preview?${params.toString()}`
}
