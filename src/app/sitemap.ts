import type { MetadataRoute } from 'next'

import { getPublishedPages } from '@/lib/cms'
import { sitemapEntry } from '@/lib/seo'

export const revalidate = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getPublishedPages()
  return pages.map((page) => sitemapEntry(page))
}
