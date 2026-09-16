import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Atkinson_Hyperlegible, Bricolage_Grotesque } from 'next/font/google'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { NoAutoScroll } from '@/components/NoAutoScroll'
import { RevealObserver } from '@/components/RevealObserver'
import { SkipLink } from '@/components/SkipLink'
import { getSiteSettings } from '@/lib/cms'
import { siteUrl } from '@/lib/site'

import './globals.css'

export const revalidate = 60

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

const DESCRIPTION =
  'Saratoga Springs Friends of Recreation supports local youth programs, playgrounds, recreational facilities, equipment, camps, and community recreation projects.'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: `${settings.siteName} | Saratoga Springs, NY`,
      template: `%s · ${settings.siteName}`,
    },
    description: DESCRIPTION,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      siteName: settings.siteName,
      locale: 'en_US',
      title: `${settings.siteName} | Saratoga Springs, NY`,
      description: DESCRIPTION,
    },
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings()
  const facebookUrl = 'facebookUrl' in settings ? settings.facebookUrl : null

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: settings.siteName,
    description: DESCRIPTION,
    url: siteUrl(),
    areaServed: 'Saratoga Springs, New York',
    ...(facebookUrl ? { sameAs: [facebookUrl] } : {}),
  }

  return (
    <html className={`${display.variable} ${body.variable}`} lang="en">
      <head>
        {/* Without JavaScript the reveal offsets must never hide content. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;filter:none!important}.cta-draw [data-stroke]{stroke-dasharray:none!important;stroke-dashoffset:0!important}.cta-draw [data-panel]{opacity:.32!important}[data-plate]{--plate-open:1}`}</style>
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{history.scrollRestoration="manual"}catch(e){}try{localStorage.removeItem("impeccable-live-session-scroll")}catch(e){}if(!location.hash)scrollTo(0,0);',
          }}
        />
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          type="application/ld+json"
        />
      </head>
      <body>
        <NoAutoScroll />
        <SkipLink />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <RevealObserver />
      {/* impeccable-live-start */}
<script src="http://localhost:8401/live.js?token=aca59555-2ba8-4680-bdd2-5ad23ba8c52a"></script>
{/* impeccable-live-end */}
</body>
    </html>
  )
}
