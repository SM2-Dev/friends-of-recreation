import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'
import type {
  BoardMember,
  Event,
  Media,
  Organization,
  Page,
  Project,
  SiteSetting,
} from '@/payload-types'
import { splitEvents } from '@/lib/events'
import { isEventDoc } from '@/lib/relations'
import type { NavItem } from '@/components/navItems'
import { primaryNav } from '@/components/navItems'
import { DEFAULT_DESCRIPTION } from '@/lib/site'
import { pageHref } from '@/lib/slug'

export const getPayloadClient = cache(async () => {
  return getPayload({ config })
})

/** Public Local API reads honor collection access so drafts and staff-only fields stay private. */
const publicRead = {
  overrideAccess: false,
  draft: false,
} as const

const fallbackSite = {
  siteName: 'Friends of Recreation',
  tagline: 'Saratoga Springs, NY',
  donationLabel: 'Donate',
  donationUrl: null,
  facebookUrl: null,
  contactEmail: null,
  footerNote: null,
  logo: null,
  defaultDescription: DEFAULT_DESCRIPTION,
  defaultSocialImage: null,
} as const

export async function getSiteSettings(): Promise<SiteSetting | typeof fallbackSite> {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
      overrideAccess: false,
    })
  } catch {
    return fallbackSite
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      depth: 2,
      limit: 1,
      pagination: false,
      ...publicRead,
      where: {
        slug: { equals: slug },
      },
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

export async function getHomePage(): Promise<Page | null> {
  return getPageBySlug('home')
}

export async function getPublishedPages(): Promise<Page[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 100,
      pagination: false,
      sort: 'navOrder',
      ...publicRead,
    })
    return result.docs
  } catch {
    return []
  }
}

export async function getNavItems(): Promise<NavItem[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 50,
      pagination: false,
      sort: 'navOrder',
      ...publicRead,
      where: {
        showInNav: { equals: true },
      },
    })

    const items = result.docs.map((page) => ({
      href: pageHref(page.slug),
      label: page.navLabel || page.title,
    }))

    return items.length > 0 ? items : primaryNav
  } catch {
    return primaryNav
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
      ...publicRead,
    })
    return result.docs
  } catch {
    return []
  }
}

/** Featured grants: the collection checkbox, newest first, at most four. */
export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projects',
      depth: 1,
      limit,
      pagination: false,
      sort: '-year',
      ...publicRead,
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
      ...publicRead,
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
      ...publicRead,
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
      ...publicRead,
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
      overrideAccess: false,
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
