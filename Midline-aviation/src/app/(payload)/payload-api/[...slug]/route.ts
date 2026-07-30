/* Payload's REST API.
 *
 * The folder is named `payload-api`, NOT `api`, and must stay in sync with
 * `routes.api` in src/payload.config.ts. The site already owns /api/booking,
 * /api/chat, /api/inquiry and /api/airports/suggest — keeping Payload on its
 * own prefix means those handlers are never shadowed.
 */
import config from '@payload-config'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
