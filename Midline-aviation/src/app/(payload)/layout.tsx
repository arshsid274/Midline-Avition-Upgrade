/* THIS FILE IS OWNED BY PAYLOAD'S INSTALL SHAPE — keep in sync with the docs.
 *
 * This layout renders its own <html>/<body>, which is why the marketing site
 * had to move into src/app/(frontend)/ with a layout of its own. Route groups
 * share a root layout, so leaving one at src/app/layout.tsx would nest <html>.
 */
import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
// The admin panel's own stylesheet. Without it Payload renders completely
// unstyled — the brand mark blows up to fill the viewport and no layout applies.
// Must come before custom.scss so overrides win.
import '@payloadcms/next/css'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
