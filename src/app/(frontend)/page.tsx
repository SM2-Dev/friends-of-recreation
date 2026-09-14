import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { SiteImage } from '@/components/SiteImage'
import { getHomePage, getSiteSettings } from '@/lib/cms'

export default async function HomePage() {
  const [home, settings] = await Promise.all([getHomePage(), getSiteSettings()])
  const donateUrl = 'donationUrl' in settings ? settings.donationUrl : null
  const objectPosition = 'heroImagePosition' in home ? home.heroImagePosition : 'center'

  return (
    <section className="hero-field">
      <div className="hero-copy">
        <Container width="narrow">
          <p className="dev-note">Development foundation. Public pages will be completed after this layout is stable.</p>
          <h1>{home.missionHeading}</h1>
          <p className="hero-body">{home.missionBody}</p>
          {donateUrl ? (
            <Button external href={donateUrl}>
              {settings.donationLabel || 'Donate'}
            </Button>
          ) : (
            <p className="donate-pending">Donation link pending board confirmation.</p>
          )}
        </Container>
      </div>
      <SiteImage
        className="hero-photo"
        media={'heroImage' in home ? home.heroImage : null}
        objectPosition={objectPosition}
        priority
        sizes="(min-width: 960px) 58vw, 100vw"
      />
    </section>
  )
}
