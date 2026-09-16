import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageLayout } from '@/components/PageLayout'
import { getHomePage, getSiteSettings } from '@/lib/cms'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getHomePage(), getSiteSettings()])
  return pageMetadata({ page, settings, isHome: true })
}

export default async function HomePage() {
  const page = await getHomePage()
  if (!page) notFound()
  return <PageLayout page={page} />
}
