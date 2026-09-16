import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'
import type {
  BoardMember,
  Event,
  HomePage,
  Media,
  Organization,
  PageContent,
  Project,
  SiteSetting,
} from '@/payload-types'
import { splitEvents } from '@/lib/events'
import { isEventDoc } from '@/lib/relations'

export const getPayloadClient = cache(async () => {
  return getPayload({ config })
})

const fallbackSite = {
  siteName: 'Friends of Recreation',
  tagline: 'Saratoga Springs, NY',
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
    'Saratoga Springs Friends of Recreation brings our community together to support the programs, facilities and opportunities that keep Saratoga active.',
  heroPhotos: [],
  heroImage: null,
  heroImagePosition: 'center',
  impactHeading: 'What your support pays for',
  impactIntro: null,
  impactStories: [],
  organizationsHeading: 'Supported programs and facilities',
  featuredOrganizations: [],
  photoSliderHeading: 'Recreation around town',
  photoSlider: [],
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
    return await payload.findGlobal({ slug: 'site-settings', depth: 1 })
  } catch {
    return fallbackSite
  }
}

export async function getHomePage(): Promise<HomePage | typeof fallbackHome> {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'home-page', depth: 2, draft: false })
  } catch {
    return fallbackHome
  }
}

export async function getPageContent(): Promise<PageContent | null> {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'page-content', depth: 1, draft: false })
  } catch {
    return null
  }
}

/** Every published project, newest funding year first. */
export async function getProjects(): Promise<Project[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projects',
      depth: 1,
      limit: 200,
      pagination: false,
      sort: '-year',
    })
    return result.docs
  } catch {
    return []
  }
}

/** Homepage featured grants: the collection checkbox, newest first, at most four. */
export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projects',
      depth: 1,
      limit,
      pagination: false,
      sort: '-year',
      where: {
        featured: { equals: true },
      },
    })
    return result.docs
  } catch {
    return []
  }
}

export async function getAllEvents(): Promise<{ upcoming: Event[]; past: Event[] }> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'events',
      depth: 1,
      limit: 200,
      pagination: false,
    })
    return splitEvents(result.docs.filter(isEventDoc))
  } catch {
    return { upcoming: [], past: [] }
  }
}

export async function getUpcomingEvents(limit = 3): Promise<Event[]> {
  const { upcoming } = await getAllEvents()
  return upcoming.slice(0, limit)
}

export async function getBoardMembers(): Promise<BoardMember[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'board-members',
      depth: 1,
      limit: 100,
      pagination: false,
      sort: 'sortOrder',
    })
    return result.docs
  } catch {
    return []
  }
}

export async function getOrganizations(): Promise<Organization[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'organizations',
      depth: 1,
      limit: 100,
      pagination: false,
      sort: 'name',
    })
    return result.docs
  } catch {
    return []
  }
}

/**
 * Public photographs from the Media library, newest first. Used for the homepage
 * photo rail and the inner-page mastheads, so editors control the imagery by
 * uploading rather than by editing code.
 */
export async function getGalleryPhotos(limit = 8, excludeId?: number | string): Promise<Media[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'media',
      depth: 0,
      limit: limit + 1,
      pagination: false,
      sort: '-createdAt',
      where: {
        visibility: { equals: 'public' },
        mimeType: { like: 'image' },
      },
    })

    return result.docs.filter((item) => item.id !== excludeId).slice(0, limit)
  } catch {
    return []
  }
}
