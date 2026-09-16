import Link from 'next/link'

import { ContactForm } from '@/components/ContactForm'
import { CtaPlaySketch } from '@/components/CtaPlaySketch'
import { DonateControl } from '@/components/DonateControl'
import { EventRow } from '@/components/EventRow'
import { FeaturedGrants } from '@/components/FeaturedGrants'
import { NextEventCard } from '@/components/NextEventCard'
import { OrgMarks } from '@/components/OrgMarks'
import { PhotoRail } from '@/components/PhotoRail'
import { SiteImage } from '@/components/SiteImage'
import {
  getFeaturedProjects,
  getHomePage,
  getPageContent,
  getSiteSettings,
  getUpcomingEvents,
} from '@/lib/cms'
import { homeHeroPhotos, homeSliderPhotos, proofItems, type HomePhoto } from '@/lib/display'
import { stagger } from '@/lib/motion'
import { isOrganization, relatedDocs } from '@/lib/relations'

export default async function HomePage() {
  const [home, settings, pageContent, upcomingEvents, featuredProjects] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getPageContent(),
    getUpcomingEvents(3),
    getFeaturedProjects(4),
  ])

  const donateUrl = 'donationUrl' in settings ? settings.donationUrl : null
  // The brief fixes the primary CTA wording; the board can still override it in Site Settings.
  const donateLabel = settings.donationLabel || 'Support Friends of Recreation'
  const facebookUrl = 'facebookUrl' in settings ? settings.facebookUrl : null

  const heroPhotos = homeHeroPhotos(home)
  const sliderPhotos = homeSliderPhotos(home)

  const pillars = 'impactStories' in home ? home.impactStories || [] : []
  const featuredOrganizations = relatedDocs(home.featuredOrganizations, isOrganization)
  const [nextEvent, ...moreEvents] = upcomingEvents

  return (
    <>
      {/* -------------------------------------- Opening: hero into mission */}
      <div className={heroPhotos.length > 0 ? 'opening opening-has-plates' : 'opening'}>
        <section className="hero">
          <div className="hero-inner" data-count={String(heroPhotos.length)}>
            <div className="hero-copy">
              <h1 className="hero-title">{home.missionHeading}</h1>
              <div className="hero-actions">
                <DonateControl
                  describedById="donate-pending-hero"
                  label={donateLabel}
                  pendingLabel={donateLabel}
                  pendingVisible
                  url={donateUrl}
                />
                <Link className="button button-secondary" href="/projects-grants">
                  View Our Impact
                </Link>
              </div>
            </div>

            <HeroPlates photos={heroPhotos} />
          </div>
        </section>

        <section aria-labelledby="mission-heading" className="opening-mission">
          <div className="band-inner mission-inner">
            <div data-reveal="idle">
              <h2 className="mission-statement" id="mission-heading">
                Saratoga Springs Friends of Recreation is a volunteer-led organization dedicated to
                supporting <span className="mark">recreation throughout our community</span>.
              </h2>
            </div>
            <div className="mission-body" data-reveal="idle" style={stagger(120)}>
              <p>
                Working alongside the Saratoga Springs Recreation Department and community partners,
                Friends of Recreation raises funds for improvements to playgrounds and athletic
                facilities, equipment for youth programs, camp opportunities, and projects that make
                recreation more accessible to Saratoga Springs families.
              </p>
              <p className="body-note">
                We are neighbours, parents, coaches, and volunteers. Every grant on this site was paid
                for by people who live here.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ------------------------------------------------------------- Pillars */}
      {pillars.length > 0 ? (
        <section aria-labelledby="impact-heading" className="band band-tint plane-over">
          <div className="band-inner">
            <div className="band-head">
              <div data-reveal="idle">
                <h2 id="impact-heading">{home.impactHeading || 'What your support pays for'}</h2>
                {home.impactIntro ? <p className="pillar-lede">{home.impactIntro}</p> : null}
              </div>
            </div>

            <ol className="pillars">
              {pillars.map((pillar, index) => {
                const proof = proofItems(pillar.proofLabel)
                return (
                  <li
                    className="pillar"
                    data-reveal="idle"
                    key={`${pillar.heading}-${index}`}
                    style={stagger(index * 110)}
                  >
                    <div className="pillar-scan">
                      <h3>{pillar.heading}</h3>
                      {proof.length > 0 ? (
                        <ul className="pillar-proof">
                          {proof.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    <div className="pillar-copy">
                      <p>{pillar.body}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>
      ) : null}

      <OrgMarks
        heading={home.organizationsHeading || 'Supported programs and facilities'}
        organizations={featuredOrganizations}
      />

      {/* -------------------------------------------------------------- Featured grants */}
      <FeaturedGrants
        emptyMessage={
          pageContent?.projects?.emptyMessage ||
          'Project stories will appear here as the board publishes confirmed grants and improvements.'
        }
        heading={home.projectsHeading || 'Featured projects and grants'}
        intro="Every line is a real thing somebody in Saratoga Springs can use: goals, seats, scoreboards, equipment, camp weeks."
        projects={featuredProjects}
      />

      {sliderPhotos.length > 0 ? (
        <section aria-labelledby="photos-heading" className="band band-flush">
          <h2 className="visually-hidden" id="photos-heading">
            {home.photoSliderHeading || 'Recreation around town'}
          </h2>
          <PhotoRail photos={sliderPhotos} />
        </section>
      ) : null}

      {/* -------------------------------------------------------------- Events */}
      <section aria-labelledby="events-heading" className="band band-tint" data-plate="hold">
        <div aria-hidden="true" className="plate-fill" />
        <div className="band-inner">
          {nextEvent ? (
            <>
              <div className="events-lead">
                <div className="events-lead-copy" data-reveal="idle">
                  <h2 id="events-heading">Upcoming events</h2>
                </div>
                <NextEventCard
                  event={nextEvent}
                  photo={sliderPhotos[0]?.media ?? heroPhotos[0]?.media}
                  revealDelay={80}
                />
              </div>
              {moreEvents.length > 0 ? (
                <ol className="event-board">
                  {moreEvents.map((event, index) => (
                    <EventRow event={event} key={event.id} revealDelay={index * 110} />
                  ))}
                </ol>
              ) : null}
              <div className="ledger-footer" data-reveal="idle">
                <Link className="arrow-link" href="/events">
                  All events
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="band-head">
                <div data-reveal="idle">
                  <h2 id="events-heading">Upcoming events</h2>
                </div>
              </div>
              <div className="pending" data-reveal="idle">
                <h3>Nothing on the calendar right now</h3>
                <p>{pageContent?.events?.emptyUpcomingMessage}</p>
                {facebookUrl ? (
                  <div className="pending-actions">
                    <a className="button button-secondary" href={facebookUrl} rel="noopener noreferrer" target="_blank">
                      Check Facebook
                      <span className="visually-hidden"> (opens in a new tab, leaves this website)</span>
                    </a>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ----------------------------------------------------------------- CTA */}
      <div className="cta-consume">
      <section aria-labelledby="donate-heading" className="cta">
        <div className="cta-inner">
          <div className="cta-heading" data-reveal="idle">
            <h2 id="donate-heading">{home.donationHeading || 'Help more kids play here'}</h2>
          </div>
          <div className="cta-copy" data-reveal="idle" style={stagger(120)}>
            {home.donationBody ? <p>{home.donationBody}</p> : null}
            <div className="cta-actions">
              <DonateControl
                describedById="donate-pending-cta"
                label={donateLabel}
                pendingVisible
                url={donateUrl}
              />
              <Link className="button button-secondary" href="/projects-grants#grant-request">
                Request grant support
              </Link>
            </div>
          </div>
          <CtaPlaySketch />
        </div>
      </section>

      {/* ------------------------------------------------------------- Contact */}
      <section aria-labelledby="contact-heading" className="band band-paper sheet-over" id="ask">
        <div className="band-inner">
          <div className="form-shell form-shell-split">
            <div data-reveal="idle">
              <h2 className="mission-statement">
                Questions, ideas, and offers to help all reach the same volunteers.
              </h2>
            </div>
            <div data-reveal="idle" style={stagger(120)}>
              <ContactForm heading={home.contactHeading || 'Ask a question'} intro={home.contactIntro} />
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}

function HeroPlates({ photos }: { photos: HomePhoto[] }) {
  if (photos.length === 0) return null

  return (
    <div className="hero-plate" data-count={String(photos.length)}>
      {photos.map((photo, index) => (
        <SiteImage
          className={`hero-plate-img hero-plate-img-${index + 1}`}
          hideWhenEmpty
          key={`${photo.media.id}-${index}`}
          media={photo.media}
          objectPosition={photo.position}
          priority={index === 0}
          sizes={
            photos.length === 1
              ? '(min-width: 52rem) 28vw, 92vw'
              : index === 0
                ? '(min-width: 52rem) 40vw, 70vw'
                : '(min-width: 52rem) 22vw, 42vw'
          }
        />
      ))}
    </div>
  )
}
