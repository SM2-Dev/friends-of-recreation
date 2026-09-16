import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageLayout } from '@/components/PageLayout'
import { getHomePage } from '@/lib/cms'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage()
  if (!page) return {}

  return {
    title: page.metaTitle || undefined,
    description: page.metaDescription || undefined,
    alternates: { canonical: '/' },
  }
}

export default async function HomePage() {
  const page = await getHomePage()
  if (!page) notFound()
  return <PageLayout page={page} />
}
