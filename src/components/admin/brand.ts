import type { Payload } from 'payload'

import { isMedia } from '@/lib/utils'

export type AdminBrand = {
  logoUrl: string
  siteName: string
  tagline: string | null
}

const fallback: AdminBrand = {
  logoUrl: '/logo.png',
  siteName: 'Friends of Recreation',
  tagline: 'Saratoga Springs, NY',
}

/**
 * Brand details for the admin chrome. Site settings are readable by anyone, so
 * this also works on the login screen before a session exists. A database that
 * is unreachable should still render a usable login page, hence the fallback.
 */
export async function getAdminBrand(payload?: Payload): Promise<AdminBrand> {
  if (!payload) return fallback

  try {
    const settings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
      overrideAccess: true,
    })

    const logo = isMedia(settings?.logo) ? settings.logo : null

    return {
      logoUrl: logo?.url || fallback.logoUrl,
      siteName: settings?.siteName || fallback.siteName,
      tagline: settings?.tagline || fallback.tagline,
    }
  } catch {
    return fallback
  }
}
