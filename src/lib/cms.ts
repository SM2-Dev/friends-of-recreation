import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'
import type { HomePage, PageContent, SiteSetting } from '@/payload-types'

export const getPayloadClient = cache(async () => {
  return getPayload({ config })
})

const fallbackSite = {
  siteName: 'Friends of Recreation',
  tagline: 'Saratoga Springs, New York',
  donationLabel: 'Donate',
  donationUrl: null,
  facebookUrl: null,
  contactEmail: null,
  footerNote: null,
  logo: null,
} as const

const fallbackHome = {
  missionHeading: 'Building More Opportunities to Play in Saratoga Springs.',
  missionBody:
    '[DEV PLACEHOLDER] Temporary development copy. Friends of Recreation raises funds for local recreation in Saratoga Springs.',
  heroImage: null,
  heroImagePosition: 'center',
  contactIntro: null,
} as const

export async function getSiteSettings(): Promise<SiteSetting | typeof fallbackSite> {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })
  } catch {
    return fallbackSite
  }
}

export async function getHomePage(): Promise<HomePage | typeof fallbackHome> {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({
      slug: 'home-page',
      depth: 1,
      draft: false,
    })
  } catch {
    return fallbackHome
  }
}

export async function getPageContent(): Promise<PageContent | null> {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({
      slug: 'page-content',
      depth: 1,
      draft: false,
    })
  } catch {
    return null
  }
}
