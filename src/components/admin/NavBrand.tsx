import type { ServerProps } from 'payload'

import { getAdminBrand } from './brand'

/** Masthead at the top of the navigation rail, linking back to the dashboard. */
export async function NavBrand({ payload }: ServerProps) {
  const brand = await getAdminBrand(payload)
  const adminRoute = payload?.config?.routes?.admin || '/admin'

  return (
    <a className="fo-navbrand" href={adminRoute}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" className="fo-navbrand__seal" src={brand.logoUrl} />
      <span className="fo-navbrand__text">
        <span className="fo-navbrand__name">{brand.siteName}</span>
        <span className="fo-navbrand__role">Content manager</span>
      </span>
    </a>
  )
}

export default NavBrand
