import { draftMode } from 'next/headers'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { PREVIEWABLE_PATHS } from '@/payload/preview/routes'

/**
 * Turns on Next's draft mode, so the editor sees unpublished content while
 * everyone else keeps getting the cached published page.
 *
 * Three gates, in order of importance:
 *
 * 1. A valid Payload session. This is the real gate. The secret travels in the
 *    iframe URL inside the admin DOM, so anyone who can read it is already
 *    logged in — it is defence in depth, not the lock.
 * 2. A known path. Redirecting to an arbitrary ?path would make this an open
 *    redirect; the allow-list already exists for the preview URLs.
 * 3. The shared secret.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const path = searchParams.get('path')

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid preview secret.', { status: 401 })
  }

  if (!path || !PREVIEWABLE_PATHS.has(path)) {
    return new Response('That page cannot be previewed.', { status: 400 })
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    return new Response('Sign in to the admin panel first.', { status: 403 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(path)
}
