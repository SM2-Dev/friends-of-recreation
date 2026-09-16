import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { PageLayout } from '@/components/PageLayout'
import { getPageBySlug, getPublishedPages, getSiteSettings } from '@/lib/cms'
import { pageMetadata } from '@/lib/seo'

type PageParams = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const pages = await getPublishedPages()
  return pages
    .filter((page) => page.slug !== 'home')
    .map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params
  if (slug === 'home') return {}

  const [page, settings] = await Promise.all([getPageBySlug(slug), getSiteSettings()])
  return pageMetadata({ page, settings })
}

export default async function CmsPage({ params }: PageParams) {
  const { slug } = await params
  if (slug === 'home') redirect('/')

  const page = await getPageBySlug(slug)
  if (!page) notFound()

  return <PageLayout page={page} />
}
