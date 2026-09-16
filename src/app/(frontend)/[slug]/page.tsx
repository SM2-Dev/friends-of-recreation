import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { PageLayout } from '@/components/PageLayout'
import { getPageBySlug, getPublishedPages } from '@/lib/cms'
import { pageHref } from '@/lib/slug'

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

  const page = await getPageBySlug(slug)
  if (!page) return { title: 'Page not found' }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || undefined,
    alternates: { canonical: pageHref(page.slug) },
  }
}

export default async function CmsPage({ params }: PageParams) {
  const { slug } = await params
  if (slug === 'home') redirect('/')

  const page = await getPageBySlug(slug)
  if (!page) notFound()

  return <PageLayout page={page} />
}
