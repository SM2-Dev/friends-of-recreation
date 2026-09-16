import { SiteImage } from '@/components/SiteImage'
import {
  eventCtaLabel,
  formatEventDateLabel,
  formatEventDay,
  formatEventMonth,
  formatEventTimeLabel,
} from '@/lib/events'
import { stagger } from '@/lib/motion'
import { cn, isMedia } from '@/lib/utils'
import type { Event } from '@/payload-types'

type EventRowProps = {
  event: Event
  revealDelay?: number
  past?: boolean
}

export function EventRow({ event, revealDelay = 0, past = false }: EventRowProps) {
  const photo = isMedia(event.image) && event.image.url ? event.image : null
  const dateLabel = formatEventDateLabel(event)
  const timeLabel = formatEventTimeLabel(event)
  const ctaLabel = event.externalUrl ? eventCtaLabel(event.externalUrl) : null

  return (
    <li
      className={cn(
        'event-row',
        event.cancelled && 'event-row-cancelled',
        past && 'event-row-past',
        photo && 'event-row-photo',
      )}
      data-reveal="idle"
      style={stagger(revealDelay)}
    >
      <time className="event-when" dateTime={event.startDate}>
        <span className="event-datebox">
          <span className="event-month">{formatEventMonth(event.startDate)}</span>
          <span className="event-day">{formatEventDay(event.startDate)}</span>
        </span>
      </time>

      <div className="event-body">
        {event.cancelled ? <p className="event-flag">Cancelled</p> : null}
        <h3 className="event-title">{event.title}</h3>
        {dateLabel || timeLabel || event.location ? (
          <p className="event-meta">
            {dateLabel ? <span className="event-date">{dateLabel}</span> : null}
            {timeLabel ? <span className="event-time">{timeLabel}</span> : null}
            {event.location ? <span className="event-place">{event.location}</span> : null}
          </p>
        ) : null}
        {event.summary ? <p className="event-summary">{event.summary}</p> : null}
        {event.externalUrl && ctaLabel ? (
          <p>
            <a
              className="arrow-link arrow-link-external"
              href={event.externalUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {ctaLabel}
              <span className="visually-hidden"> (opens in a new tab, leaves this website)</span>
            </a>
          </p>
        ) : null}
      </div>

      {photo ? (
        <SiteImage
          className="event-photo"
          hideWhenEmpty
          media={photo}
          sizes="(min-width: 52rem) 18rem, (min-width: 40rem) 34vw, 92vw"
        />
      ) : null}
    </li>
  )
}
