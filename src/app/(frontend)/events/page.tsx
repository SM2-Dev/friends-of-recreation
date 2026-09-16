import { DonateBand } from '@/components/DonateBand'
import { EventRow } from '@/components/EventRow'
import { PageMasthead } from '@/components/PageMasthead'
import { getAllEvents, getGalleryPhotos, getPageContent, getSiteSettings } from '@/lib/cms'
import { isMedia } from '@/lib/utils'

export const metadata = {
  title: 'Events',
  description:
    'Upcoming and past Friends of Recreation events in Saratoga Springs, including community gatherings and fundraisers.',
}

export default async function EventsPage() {
  const [content, settings, events] = await Promise.all([
    getPageContent(),
    getSiteSettings(),
    getAllEvents(),
  ])

  const logoId = isMedia(settings.logo) ? settings.logo.id : undefined
  // Each inner page takes a different photograph from the gallery so the
  // mastheads do not repeat as a visitor moves through the site.
  const gallery = await getGalleryPhotos(6, logoId)
  const banner = gallery[5] ?? gallery[0] ?? null
  const facebookUrl = 'facebookUrl' in settings ? settings.facebookUrl : null
  const { upcoming, past } = events

  return (
    <>
      <PageMasthead
        heading={content?.events?.heading || 'Get out and play with us'}
        lede={content?.events?.intro}
        photo={banner}
      />

      <section aria-labelledby="upcoming-heading" className="band band-paper">
        <div className="band-inner">
          <div className="band-head">
            <div data-reveal="idle">
              <h2 id="upcoming-heading">Upcoming events</h2>
            </div>
          </div>
          {upcoming.length > 0 ? (
            <ol className="event-list">
              {upcoming.map((event, index) => (
                <EventRow event={event} key={event.id} revealDelay={index * 90} />
              ))}
            </ol>
          ) : (
            <div className="pending" data-reveal="idle">
              <h3>Nothing on the calendar right now</h3>
              <p>{content?.events?.emptyUpcomingMessage}</p>
              {facebookUrl ? (
                <div className="pending-actions">
                  <a
                    className="button button-secondary"
                    href={facebookUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Check Facebook
                    <span className="visually-hidden"> (opens in a new tab, leaves this website)</span>
                  </a>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {past.length > 0 ? (
        <section aria-labelledby="past-heading" className="band band-tint">
          <div className="band-inner">
            <div className="band-head">
              <div data-reveal="idle">
                <h2 id="past-heading">Past events</h2>
              </div>
            </div>
            <ol className="event-list">
              {past.map((event, index) => (
                <EventRow event={event} key={event.id} past revealDelay={index * 70} />
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <DonateBand headingId="events-donate-heading" secondary={{ href: '/#ask', label: 'Ask a question' }} />
    </>
  )
}
