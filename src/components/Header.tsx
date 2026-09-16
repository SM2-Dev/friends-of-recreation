import Link from 'next/link'

import { DonateControl } from '@/components/DonateControl'
import { MobileNav } from '@/components/MobileNav'
import { NavLinks } from '@/components/NavLinks'
import { getNavItems, getSiteSettings } from '@/lib/cms'
import { isMedia } from '@/lib/utils'

export async function Header() {
  const [settings, nav] = await Promise.all([getSiteSettings(), getNavItems()])
  const logo = isMedia(settings.logo) ? settings.logo : null
  const donateUrl = 'donationUrl' in settings ? settings.donationUrl : null
  const donateLabel = settings.donationLabel || 'Donate'

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="site-logo" href="/">
          {/*
            The circular seal is the brand mark on its own. Payload logo files vary
            in dimension, which is why this is a plain img rather than next/image.
            The site name stays in the accessible name of the home link.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="site-logo-image" src={logo?.url || '/logo.png'} />
          <span className="visually-hidden">{settings.siteName}</span>
        </Link>

        <NavLinks items={nav} />

        <div className="site-header-actions">
          <DonateControl
            describedById="donate-pending-header"
            label={donateLabel}
            pendingLabel="Support us"
            url={donateUrl}
          />
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  )
}
