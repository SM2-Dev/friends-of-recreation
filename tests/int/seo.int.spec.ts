import { describe, expect, it } from 'vitest'

import { pageMetadata, sitemapEntry } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import type { Page } from '@/payload-types'

const settings = {
  siteName: 'Friends of Recreation',
  defaultDescription:
    'Saratoga Springs Friends of Recreation supports local youth programs, playgrounds, recreational facilities, equipment, camps, and community recreation projects.',
}

function page(partial: Partial<Page> & Pick<Page, 'title' | 'slug'>): Page {
  return {
    id: 1,
    updatedAt: '2026-09-16T12:00:00.000Z',
    createdAt: '2026-09-16T12:00:00.000Z',
    _status: 'published',
    ...partial,
  }
}

describe('page metadata', () => {
  it('uses the homepage title as-is and does not append the site name', () => {
    const metadata = pageMetadata({
      isHome: true,
      settings,
      page: page({
        title: 'Home',
        slug: 'home',
        metaTitle: 'Friends of Recreation | Saratoga Springs, NY',
        metaDescription: settings.defaultDescription,
      }),
    })

    expect(metadata.title).toEqual({ absolute: 'Friends of Recreation | Saratoga Springs, NY' })
    expect(metadata.description).toBe(settings.defaultDescription)
    expect(metadata.alternates).toEqual({ canonical: '/' })
  })

  it('gives inner pages a unique title and canonical path', () => {
    const metadata = pageMetadata({
      settings,
      page: page({
        title: 'Events',
        slug: 'events',
        metaTitle: 'Events',
        metaDescription: 'Upcoming and past Friends of Recreation events in Saratoga Springs.',
      }),
    })

    expect(metadata.title).toBe('Events')
    expect(metadata.openGraph?.title).toBe('Events · Friends of Recreation')
    expect(metadata.description).toBe('Upcoming and past Friends of Recreation events in Saratoga Springs.')
    expect(metadata.alternates).toEqual({ canonical: '/events' })
  })

  it('does not index missing pages', () => {
    const metadata = pageMetadata({ page: null, settings })
    expect(metadata.robots).toEqual({ index: false, follow: false })
  })

  it('builds sitemap entries from published slugs', () => {
    expect(sitemapEntry({ slug: 'home', updatedAt: '2026-09-16T12:00:00.000Z' })).toEqual({
      url: absoluteUrl('/'),
      lastModified: new Date('2026-09-16T12:00:00.000Z'),
    })
    expect(sitemapEntry({ slug: 'projects-grants', updatedAt: '2026-09-16T12:00:00.000Z' }).url).toBe(
      absoluteUrl('/projects-grants'),
    )
  })
})
