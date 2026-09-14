import Link from 'next/link'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { primaryNav } from '@/components/navItems'
import { getSiteSettings } from '@/lib/cms'

export async function Footer() {
  const settings = await getSiteSettings()
  const donateUrl = 'donationUrl' in settings ? settings.donationUrl : null
  const facebookUrl = 'facebookUrl' in settings ? settings.facebookUrl : null
  const contactEmail = 'contactEmail' in settings ? settings.contactEmail : null

  return (
    <footer className="site-footer">
      <Container className="site-footer-inner" width="wide">
        <div className="site-footer-brand">
          <p className="site-footer-name">{settings.siteName}</p>
          {settings.tagline ? <p>{settings.tagline}</p> : null}
          {settings.footerNote ? <p className="site-footer-note">{settings.footerNote}</p> : null}
        </div>

        <nav aria-label="Footer">
          <ul className="site-footer-nav">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer-actions">
          {donateUrl ? (
            <Button external href={donateUrl} variant="secondary">
              {settings.donationLabel || 'Donate'}
            </Button>
          ) : (
            <p className="donate-pending">Donation link pending board confirmation.</p>
          )}
          {facebookUrl ? (
            <a href={facebookUrl} rel="noopener noreferrer" target="_blank">
              Facebook
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          ) : null}
          {contactEmail ? <a href={`mailto:${contactEmail}`}>{contactEmail}</a> : null}
        </div>
      </Container>
    </footer>
  )
}
