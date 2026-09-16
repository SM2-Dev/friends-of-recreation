const FALLBACK_URL = 'http://localhost:3000'

export const DEFAULT_TITLE = 'Friends of Recreation | Saratoga Springs, NY'

export const DEFAULT_DESCRIPTION =
  'Saratoga Springs Friends of Recreation supports local youth programs, playgrounds, recreational facilities, equipment, camps, and community recreation projects.'

export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL
  if (configured) return configured.replace(/\/$/, '')

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`

  return FALLBACK_URL
}

export function allowSearchIndexing(): boolean {
  return process.env.SITE_NOINDEX !== 'true'
}

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path
  const base = siteUrl()
  if (!path || path === '/') return base
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

