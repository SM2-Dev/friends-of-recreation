import Link from 'next/link'

import { Container } from '@/components/Container'
import { DonateControl } from '@/components/DonateControl'
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
        <div>
          <p className="site-footer-name">{settings.siteName}</p>
          {settings.tagline ? <p className="site-footer-tagline">{settings.tagline}</p> : null}
          {settings.footerNote ? <p className="site-footer-note">{settings.footerNote}</p> : null}
        </div>

        <nav aria-label="Footer">
          <p className="site-footer-heading">Pages</p>
          <ul className="site-footer-nav">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="site-footer-heading">Get in touch</p>
          <ul className="site-footer-links">
            <li>
              <Link href="/#ask">Ask a question</Link>
            </li>
            <li>
              <Link href="/projects-grants#grant-request">Request grant support</Link>
            </li>
            {facebookUrl ? (
              <li>
                <a href={facebookUrl} rel="noopener noreferrer" target="_blank">
                  Facebook
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            ) : null}
            {contactEmail ? (
              <li>
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </li>
            ) : null}
          </ul>
        </div>

        <div className="site-footer-actions">
          <p className="site-footer-heading">Support recreation</p>
          <DonateControl
            describedById="donate-pending-footer"
            label={settings.donationLabel || 'Donate'}
            pendingVisible
            url={donateUrl}
          />
        </div>

        <div className="site-footer-base">
          <p>
            Friends of Recreation works alongside the Saratoga Springs Recreation Department and the
            Community Foundation for the Greater Capital Region.
          </p>
          <p>Volunteer-led in Saratoga Springs, New York.</p>
        </div>
      </Container>
    </footer>
  )
}
