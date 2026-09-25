/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import { Atkinson_Hyperlegible, Bricolage_Grotesque } from 'next/font/google'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.css'

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
  variable: '--font-bricolage',
  display: 'swap',
})

const body = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-atkinson',
  display: 'swap',
})

export const dynamic = 'force-dynamic'
export const maxDuration = 60

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
  <RootLayout
    config={config}
    htmlProps={{ className: `${display.variable} ${body.variable}` }}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    {children}
  </RootLayout>
)

export default Layout
