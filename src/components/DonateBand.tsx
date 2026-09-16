import Link from 'next/link'

import { CtaPlaySketch } from '@/components/CtaPlaySketch'
import { DonateControl } from '@/components/DonateControl'
import { getHomePage, getSiteSettings } from '@/lib/cms'
import { stagger } from '@/lib/motion'

type DonateBandProps = {
  headingId?: string
  secondary?: { href: string; label: string }
}

/** The closing Donate field, shared by the inner routes. */
export async function DonateBand({
  headingId = 'donate-band-heading',
  secondary,
}: DonateBandProps) {
  const [settings, home] = await Promise.all([getSiteSettings(), getHomePage()])
  const donateUrl = 'donationUrl' in settings ? settings.donationUrl : null

  return (
    <section aria-labelledby={headingId} className="cta">
      <div className="cta-inner">
        <div className="cta-heading" data-reveal="idle">
          <h2 id={headingId}>{home.donationHeading || 'Help more kids play here'}</h2>
        </div>
        <div className="cta-copy" data-reveal="idle" style={stagger(120)}>
          {home.donationBody ? <p>{home.donationBody}</p> : null}
          <div className="cta-actions">
            <DonateControl
              describedById={`${headingId}-pending`}
              label={settings.donationLabel || 'Donate'}
              pendingVisible
              url={donateUrl}
            />
            {secondary ? (
              <Link className="button button-secondary" href={secondary.href}>
                {secondary.label}
              </Link>
            ) : null}
          </div>
        </div>
        <CtaPlaySketch />
      </div>
    </section>
  )
}
