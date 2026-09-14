import Link from 'next/link'

import { Button } from '@/components/Button'
import { MobileNav } from '@/components/MobileNav'
import { primaryNav } from '@/components/navItems'
import { getSiteSettings } from '@/lib/cms'
import { isMedia } from '@/lib/utils'

export async function Header() {
  const settings = await getSiteSettings()
  const logo = isMedia(settings.logo) ? settings.logo : null
  const donateUrl = 'donationUrl' in settings ? settings.donationUrl : null
  const donateLabel = settings.donationLabel || 'Donate'

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="site-logo" href="/">
          {logo?.url ? (
            // Logo files vary in size; keep the wordmark available to screen readers.
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" className="site-logo-image" src={logo.url} />
          ) : null}
          <span className={logo?.url ? 'visually-hidden' : undefined}>{settings.siteName}</span>
        </Link>

        <nav aria-label="Primary" className="desktop-nav">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header-actions">
          {donateUrl ? (
            <Button className="donate-button" external href={donateUrl} variant="primary">
              {donateLabel}
            </Button>
          ) : (
            <p className="donate-pending">Donation link pending board confirmation.</p>
          )}
          <MobileNav items={primaryNav} />
        </div>
      </div>
    </header>
  )
}
