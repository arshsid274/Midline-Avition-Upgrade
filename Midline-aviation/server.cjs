/**
 * Passenger entry point for cPanel's "Setup Node.js App".
 *
 * cPanel runs Node through Phusion Passenger, which expects a single startup
 * file that creates a server and listens — it will not run `next start` for
 * you. This is that file.
 *
 * Deliberately .cjs: package.json declares "type": "module" (required so
 * Payload's CLI can resolve its own imports), and Passenger's loader is more
 * reliable with CommonJS. The .cjs extension forces CommonJS for this file
 * alone and leaves the rest of the project as ESM.
 *
 * Passenger supplies PORT. Do not hardcode one — binding to the wrong port is
 * the usual reason an app "starts" but serves nothing.
 *
 * Prerequisites on the server:
 *   1. `npm ci --omit=dev` in the application root (native modules must be
 *      installed ON the server, not uploaded from a Mac).
 *   2. A production build present — either run `npm run build` there, or
 *      upload the .next directory if the build runs out of memory.
 *   3. Environment variables set in cPanel's Node.js App screen, not in .env:
 *      DATABASE_URI, PAYLOAD_SECRET, PREVIEW_SECRET, NEXT_PUBLIC_SERVER_URL
 *      and the SMTP_* values.
 */
const { createServer } = require('http')
const next = require('next')

const port = parseInt(process.env.PORT || '3000', 10)

// Never `dev: true` here — Passenger runs the production build.
const app = next({ dev: false })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res)
    }).listen(port, () => {
      console.log(`Midline Aviation ready on port ${port}`)
    })
  })
  .catch((error) => {
    // Passenger swallows stack traces unless they reach stderr, and a silent
    // failure here looks identical to "the app just doesn't work".
    console.error('Failed to start Next.js:', error)
    process.exit(1)
  })
