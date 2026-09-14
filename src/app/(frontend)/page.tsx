import Link from 'next/link'

import { ContactForm } from '@/components/ContactForm'
import { DonateControl } from '@/components/DonateControl'
import { SiteImage } from '@/components/SiteImage'
import { getHomePage, getPageContent, getSiteSettings, getUpcomingEvents } from '@/lib/cms'
import { formatEventDate, formatEventDay, formatEventMonth } from '@/lib/events'
import { isOrganization, isProject, relatedDocs } from '@/lib/relations'
import type { Event, Organization, Project } from '@/payload-types'

export default async function HomePage() {
  const [home, settings, pageContent, upcomingEvents] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getPageContent(),
    getUpcomingEvents(3),
  ])

  const donateUrl = 'donationUrl' in settings ? settings.donationUrl : null
  const donateLabel = settings.donationLabel || 'Donate'
  const facebookUrl = 'facebookUrl' in settings ? settings.facebookUrl : null
  const objectPosition = 'heroImagePosition' in home ? home.heroImagePosition : 'center'
  const organizations = relatedDocs(home.featuredOrganizations, isOrganization)
  const projects = relatedDocs(home.featuredProjects, isProject)
  const [featuredProject, ...supportingProjects] = projects
  const impactStories = 'impactStories' in home ? home.impactStories || [] : []
  const nextEvent = upcomingEvents[0]
  const emptyProjects = pageContent?.projects?.emptyMessage
  const emptyEvents = pageContent?.events?.emptyUpcomingMessage

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-copy">
          <div className="home-hero-copy-inner">
            <h1>{home.missionHeading}</h1>
            <DonateControl
              describedById="donate-pending-hero"
              label={donateLabel}
              pendingVisible
              url={donateUrl}
            />
            <p className="home-hero-body">{home.missionBody}</p>
            {nextEvent ? <NextEventStrip event={nextEvent} /> : null}
          </div>
        </div>
        <SiteImage
          className="home-hero-photo"
          media={'heroImage' in home ? home.heroImage : null}
          objectPosition={objectPosition}
          priority
          sizes="(min-width: 960px) 62vw, 100vw"
        />
      </section>

      <section aria-labelledby="impact-heading" className={`home-impact${impactStories.length ? '' : ' home-section-empty'}`}>
        <div className="home-band home-band-wide">
          <h2 id="impact-heading">{home.impactHeading || 'Community impact'}</h2>
          {home.impactIntro ? <p className="home-impact-intro">{home.impactIntro}</p> : null}
          {impactStories.length > 0 ? (
            <ol className="home-impact-stories">
              {impactStories.map((story, index) => (
                <li className={`home-impact-story home-impact-story-${index + 1}`} key={`${story.heading}-${index}`}>
                  <h3>{story.heading}</h3>
                  {story.proofLabel ? <p className="proof-chip">{story.proofLabel}</p> : null}
                  <p>{story.body}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p>Confirmed impact stories will appear here as the board publishes them.</p>
          )}
        </div>
      </section>

      <section
        aria-labelledby="orgs-heading"
        className={`home-orgs${organizations.length ? '' : ' home-section-empty'}`}
      >
        <div className="home-band home-band-wide">
          <h2 id="orgs-heading">{home.organizationsHeading || 'Supported programs and facilities'}</h2>
          {organizations.length > 0 ? (
            <ul className="home-org-strip">
              {organizations.map((organization) => (
                <li className="home-org" key={organization.id}>
                  <OrganizationName organization={organization} />
                  {organization.summary ? <p>{organization.summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p>Supported programs and facilities will appear here once they are confirmed.</p>
          )}
        </div>
      </section>

      <section
        aria-labelledby="projects-heading"
        className={`home-projects${featuredProject ? '' : ' home-section-empty'}`}
      >
        <div className="home-band home-band-wide">
          <div className="home-projects-heading">
            <h2 id="projects-heading">{home.projectsHeading || 'Featured projects and grants'}</h2>
            {featuredProject ? (
              <Link className="home-inline-link" href="/projects-grants">
                All projects
              </Link>
            ) : null}
          </div>
          {featuredProject ? (
            <div className="home-projects-layout">
              <FeaturedProject project={featuredProject} />
              {supportingProjects.length > 0 ? (
                <ul className="home-project-rows">
                  {supportingProjects.map((project) => (
                    <li key={project.id}>
                      <ProjectRow project={project} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : (
            <p>{emptyProjects || 'Project stories will appear here as the board publishes confirmed grants and improvements.'}</p>
          )}
        </div>
      </section>

      <section
        aria-labelledby="events-heading"
        className={`home-events${upcomingEvents.length ? '' : ' home-section-empty'}`}
      >
        <div className="home-band home-band-wide">
          <div className="home-projects-heading">
            <h2 id="events-heading">{pageContent?.events?.heading || 'Upcoming events'}</h2>
            {upcomingEvents.length > 0 ? (
              <Link className="home-inline-link" href="/events">
                All events
              </Link>
            ) : null}
          </div>
          {upcomingEvents.length > 0 ? (
            <ol className="home-event-list">
              {upcomingEvents.map((event) => (
                <li key={event.id}>
                  <EventRow event={event} />
                </li>
              ))}
            </ol>
          ) : (
            <p>
              {emptyEvents}
              {facebookUrl ? (
                <>
                  {' '}
                  <a href={facebookUrl} rel="noopener noreferrer" target="_blank">
                    Facebook
                    <span className="visually-hidden"> (opens in a new tab, leaves this website)</span>
                  </a>
                </>
              ) : null}
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="donate-heading" className="home-donate">
        <div className="home-band home-band-narrow">
          <h2 id="donate-heading">{home.donationHeading || 'Help more kids play here'}</h2>
          {home.donationBody ? <p>{home.donationBody}</p> : null}
          <DonateControl
            describedById="donate-pending-band"
            label={donateLabel}
            pendingVisible
            url={donateUrl}
          />
        </div>
      </section>

      <section aria-labelledby="contact-heading" className="home-contact">
        <div className="home-band home-band-narrow">
          <ContactForm heading={home.contactHeading || 'Ask a question'} intro={home.contactIntro} />
        </div>
      </section>
    </>
  )
}

function NextEventStrip({ event }: { event: Event }) {
  return (
    <p className="home-next-event">
      <Link className="home-next-event-link" href="/events">
        <span className="home-next-event-date">{formatEventDate(event)}</span>
        <span className="home-next-event-title">{event.title}</span>
      </Link>
    </p>
  )
}

function OrganizationName({ organization }: { organization: Organization }) {
  if (organization.website) {
    return (
      <a className="home-org-name" href={organization.website} rel="noopener noreferrer" target="_blank">
        {organization.name}
        <span className="visually-hidden"> (opens in a new tab, leaves this website)</span>
      </a>
    )
  }

  return <p className="home-org-name">{organization.name}</p>
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="home-project-feature">
      <SiteImage
        className="home-project-photo"
        media={project.image}
        objectPosition="center"
        sizes="(min-width: 960px) 48vw, 100vw"
      />
      <div className="home-project-feature-copy">
        <p className="proof-chip">
          <span>{project.year}</span>
          {project.amountLabel ? <span>{project.amountLabel}</span> : null}
          {project.recipient ? <span>{project.recipient}</span> : null}
        </p>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        {project.beneficiaries ? <p className="home-project-benefit">{project.beneficiaries}</p> : null}
      </div>
    </article>
  )
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <article className="home-project-row">
      <p className="home-project-year">{project.year}</p>
      <div>
        <h3>{project.title}</h3>
        <p>
          {[project.recipient, project.amountLabel].filter(Boolean).join(' · ')}
        </p>
        {project.beneficiaries ? <p className="home-project-benefit">{project.beneficiaries}</p> : null}
      </div>
    </article>
  )
}

function EventRow({ event }: { event: Event }) {
  return (
    <article className={`home-event${event.cancelled ? ' home-event-cancelled' : ''}`}>
      <time className="home-event-when" dateTime={event.startDate}>
        <span className="home-event-month">{formatEventMonth(event.startDate)}</span>
        <span className="home-event-day">{formatEventDay(event.startDate)}</span>
      </time>
      <div className="home-event-body">
        <h3>
          {event.title}
          {event.cancelled ? <span className="home-event-flag"> Cancelled</span> : null}
        </h3>
        <p className="home-event-meta">
          <span>{formatEventDate(event)}</span>
          {event.location ? <span>{event.location}</span> : null}
        </p>
        {event.externalUrl ? (
          <a href={event.externalUrl} rel="noopener noreferrer" target="_blank">
            Event details
            <span className="visually-hidden"> (opens in a new tab, leaves this website)</span>
          </a>
        ) : null}
      </div>
    </article>
  )
}
