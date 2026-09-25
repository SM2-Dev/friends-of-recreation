import type { ServerProps } from 'payload'

import { getAdminBrand } from './brand'

/**
 * Replaces the Payload mark in the breadcrumb bar. Rendered at 22px, so the
 * seal reads as a shape rather than as readable lettering; the breadcrumb text
 * beside it carries the meaning.
 */
export async function BrandIcon({ payload }: ServerProps) {
  const brand = await getAdminBrand(payload)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={`${brand.siteName} home`} className="fo-mark" src={brand.logoUrl} />
  )
}

export default BrandIcon
