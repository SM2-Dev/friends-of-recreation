import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'
import type { Event, HomePage, PageContent, SiteSetting } from '@/payload-types'
import { splitEvents } from '@/lib/events'
import { isEventDoc } from '@/lib/relations'

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
  impactHeading: 'Community impact',
  impactIntro: null,
  impactStories: [],
  organizationsHeading: 'Supported programs and facilities',
  featuredOrganizations: [],
  projectsHeading: 'Featured projects and grants',
  featuredProjects: [],
  donationHeading: 'Help more kids play here',
  donationBody: null,
  contactHeading: 'Ask a question',
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
      depth: 2,
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

export async function getUpcomingEvents(limit = 3): Promise<Event[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'events',
      depth: 1,
      limit: 50,
      pagination: false,
    })
    const events = result.docs.filter(isEventDoc)
    return splitEvents(events).upcoming.slice(0, limit)
  } catch {
    return []
  }
}
