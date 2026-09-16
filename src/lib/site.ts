const FALLBACK_URL = 'http://localhost:3000'

export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL
  if (configured) return configured.replace(/\/$/, '')

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`

  return FALLBACK_URL
}
