import type { ServerProps } from 'payload'

import { getAdminBrand } from './brand'

/**
 * Brand block on the login and email-verification screens. Payload renders no
 * heading on those views, so the accessible name of the page lives here. The
 * mark already sets the organization name, which is why only the role is shown.
 */
export async function BrandLogo({ payload }: ServerProps) {
  const brand = await getAdminBrand(payload)

  return (
    <div className="fo-login-brand">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" className="fo-login-brand__seal" src={brand.logoUrl} />
      <h1 className="fo-login-brand__role">
        <span className="sr-only">{brand.siteName} — </span>
        Content manager
      </h1>
    </div>
  )
}

export default BrandLogo
