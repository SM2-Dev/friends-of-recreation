import type { Metadata } from 'next'

import { absoluteUrl, DEFAULT_DESCRIPTION, DEFAULT_TITLE, siteUrl } from '@/lib/site'
import { pageHref } from '@/lib/slug'
import { isMedia } from '@/lib/utils'
import type { Page, SiteSetting } from '@/payload-types'

export { DEFAULT_DESCRIPTION, DEFAULT_TITLE }

type SeoSettings = Pick<SiteSetting, 'siteName'> & {
  logo?: SiteSetting['logo']
  facebookUrl?: SiteSetting['facebookUrl']
  defaultDescription?: SiteSetting['defaultDescription']
  defaultSocialImage?: SiteSetting['defaultSocialImage']
}

export function mediaAbsoluteUrl(media: unknown): string | null {
  if (!isMedia(media) || !media.url) return null
  return absoluteUrl(media.url)
}

export function defaultDescription(settings: SeoSettings): string {
  return settings.defaultDescription?.trim() || DEFAULT_DESCRIPTION
}

export function homeTitle(page: Page | null, settings: SeoSettings): string {
  return page?.metaTitle?.trim() || DEFAULT_TITLE.replace('Friends of Recreation', settings.siteName)
}

export function innerPageTitle(page: Page): string {
  return page.metaTitle?.trim() || page.title
}

export function pageDescription(page: Page | null, settings: SeoSettings): string {
  return page?.metaDescription?.trim() || defaultDescription(settings)
}

export function pagePath(page: Page): string {
  return pageHref(page.slug)
}

type SocialImage = {
  url: string
  alt: string
  width?: number
  height?: number
}

function socialImageFromMedia(media: unknown, fallbackAlt: string): SocialImage | null {
  if (!isMedia(media) || !media.url) return null
  const url = mediaAbsoluteUrl(media)
  if (!url) return null

  return {
    url,
    alt: media.alt?.trim() || fallbackAlt,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
  }
}

export function resolveSocialImage(page: Page | null, settings: SeoSettings): SocialImage {
  const fromPage = socialImageFromMedia(page?.ogImage, settings.siteName)
  if (fromPage) return fromPage

  const fromSettings = socialImageFromMedia(settings.defaultSocialImage, settings.siteName)
  if (fromSettings) return fromSettings

  const fromLogo = socialImageFromMedia(settings.logo, settings.siteName)
  if (fromLogo) return fromLogo

  return {
    url: absoluteUrl('/logo.png'),
    alt: settings.siteName,
  }
}

export function pageMetadata({
  page,
  settings,
  isHome = false,
}: {
  page: Page | null
  settings: SeoSettings
  isHome?: boolean
}): Metadata {
  if (!page) {
    return {
      title: 'Page not found',
      robots: { index: false, follow: false },
    }
  }

  const path = isHome ? '/' : pagePath(page)
  const canonical = absoluteUrl(path)
  const description = pageDescription(page, settings)
  const title = isHome ? homeTitle(page, settings) : innerPageTitle(page)
  const ogTitle = isHome ? title : `${title} · ${settings.siteName}`
  const image = resolveSocialImage(page, settings)

  return {
    title: isHome ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: settings.siteName,
      title: ogTitle,
      description,
      url: canonical,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [image.url],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export function organizationJsonLd(settings: SeoSettings) {
  const logo = mediaAbsoluteUrl(settings.logo) || absoluteUrl('/logo.png')
  const facebookUrl = settings.facebookUrl?.trim()

  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: settings.siteName,
    alternateName: 'Saratoga Springs Friends of Recreation',
    description: defaultDescription(settings),
    url: siteUrl(),
    logo,
    image: logo,
    areaServed: {
      '@type': 'City',
      name: 'Saratoga Springs',
      containedInPlace: {
        '@type': 'State',
        name: 'New York',
      },
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Saratoga Springs',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
    ...(facebookUrl ? { sameAs: [facebookUrl] } : {}),
  }
}

export function sitemapEntry(page: Pick<Page, 'slug' | 'updatedAt'>): {
  url: string
  lastModified: Date
} {
  return {
    url: absoluteUrl(pageHref(page.slug)),
    lastModified: new Date(page.updatedAt),
  }
}
