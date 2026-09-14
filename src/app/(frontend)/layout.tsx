import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Atkinson_Hyperlegible, Bricolage_Grotesque } from 'next/font/google'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SkipLink } from '@/components/SkipLink'
import { getSiteSettings } from '@/lib/cms'

import './globals.css'

export const revalidate = 60

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

const body = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-atkinson',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    title: {
      default: settings.siteName,
      template: `%s · ${settings.siteName}`,
    },
    description:
      'Saratoga Springs Friends of Recreation raises funds for recreation programs, facilities, equipment, camps, scholarships, and community projects.',
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${display.variable} ${body.variable}`} lang="en">
      <body>
        <SkipLink />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
