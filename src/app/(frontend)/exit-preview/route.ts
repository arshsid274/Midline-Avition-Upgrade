import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Leaves draft mode.
 *
 * Not optional. The draft cookie is domain-wide, so an editor who previews
 * once keeps seeing unpublished content everywhere on the site for the rest of
 * the browser session — and reports it as the site being broken.
 */
export async function GET(request: Request) {
  const draft = await draftMode()
  draft.disable()

  const { searchParams } = new URL(request.url)
  const back = searchParams.get('path')
  redirect(back && back.startsWith('/') ? back : '/')
}
