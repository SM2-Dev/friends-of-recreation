import { SiteImage } from '@/components/SiteImage'
import { formatEventDay, formatEventMonth } from '@/lib/events'
import { stagger } from '@/lib/motion'
import { cn, isMedia } from '@/lib/utils'
import type { Event, Media } from '@/payload-types'

type NextEventCardProps = {
  event: Event
  revealDelay?: number
  /** Recreation photograph the ticket rides when the event has no image of its own. */
  photo?: Media | null
}

export function NextEventCard({ event, revealDelay = 0, photo = null }: NextEventCardProps) {
  const eventImage = isMedia(event.image) && event.image.url ? event.image : null
  const fallback = isMedia(photo) && photo.url ? photo : null
  const image = eventImage ?? fallback
  const titleId = `next-event-title-${event.id}`
  const body = (
    <>
      <time className="next-event-chip" dateTime={event.startDate}>
        <span className="next-event-month">{formatEventMonth(event.startDate)}</span>
        <span className="next-event-day">{formatEventDay(event.startDate)}</span>
      </time>
      <div className="next-event-copy">
        {event.cancelled ? <p className="event-flag">Cancelled</p> : null}
        <p className="next-event-caption">Next event</p>
        <h3 className="next-event-title" id={titleId}>
          {event.title}
        </h3>
      </div>
    </>
  )

  return (
    <article
      aria-labelledby={titleId}
      className={cn('next-event', !image && 'next-event-bare')}
      data-reveal="idle"
      style={stagger(revealDelay)}
    >
      {image ? (
        <SiteImage
          className="next-event-photo"
          hideWhenEmpty
          media={image}
          sizes="(min-width: 52rem) 48rem, 92vw"
        />
      ) : null}
      {event.externalUrl ? (
        <a
          className="next-event-card"
          href={event.externalUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {body}
          <span className="visually-hidden"> (opens in a new tab, leaves this website)</span>
        </a>
      ) : (
        <div className="next-event-card">{body}</div>
      )}
    </article>
  )
}
