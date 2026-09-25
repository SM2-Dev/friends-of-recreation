import Link from 'next/link'

import { CtaPlaySketch } from '@/components/CtaPlaySketch'
import { DonateControl } from '@/components/DonateControl'
import { getSiteSettings } from '@/lib/cms'
import { stagger } from '@/lib/motion'
import { cn } from '@/lib/utils'

type DonateBandProps = {
  heading?: string | null
  body?: string | null
  headingId?: string
  secondary?: { href: string; label: string } | null
  className?: string
}

/** The closing Donate field. Copy comes from the Donate section on the page. */
export async function DonateBand({
  heading = 'Help more kids play here',
  body,
  headingId = 'donate-band-heading',
  secondary,
  className,
}: DonateBandProps) {
  const settings = await getSiteSettings()
  const donateUrl = 'donationUrl' in settings ? settings.donationUrl : null

  return (
    <section aria-labelledby={headingId} className={cn('cta', className)}>
      <div className="cta-inner">
        <div className="cta-heading" data-reveal="idle">
          <h2 id={headingId}>{heading || 'Help more kids play here'}</h2>
        </div>
        <div className="cta-copy" data-reveal="idle" style={stagger(120)}>
          {body ? <p>{body}</p> : null}
          <div className="cta-actions">
            <DonateControl label={settings.donationLabel || 'Donate'} url={donateUrl} />
            {secondary?.href && secondary.label ? (
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
