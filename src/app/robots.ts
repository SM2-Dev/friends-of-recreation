import type { MetadataRoute } from 'next'

import { absoluteUrl, allowSearchIndexing } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  if (!allowSearchIndexing()) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
