const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'graphql',
  'graphql-playground',
  'next',
  '_next',
  'media',
  'login',
  'create-first-user',
  'robots-txt',
  'sitemap-xml',
])

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug)
}

export function pageHref(slug: string): string {
  return slug === 'home' ? '/' : `/${slug}`
}

export function validatePageSlug(value: unknown): true | string {
  if (typeof value !== 'string' || !value.trim()) return 'Enter a slug.'
  const slug = slugify(value)
  if (!slug) return 'Enter a slug made of letters, numbers, and hyphens.'
  if (isReservedSlug(slug)) return `"${slug}" is reserved by the site and cannot be used.`
  return true
}
