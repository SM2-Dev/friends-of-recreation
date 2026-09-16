export type EventDateFields = {
  startDate: string
  endDate?: string | null
  cancelled?: boolean | null
}

export function getEventAnchorDate(event: EventDateFields): string {
  return event.endDate || event.startDate
}

export function isUpcomingEvent(event: EventDateFields, now = new Date()): boolean {
  const anchor = dateParts(getEventAnchorDate(event))
  const today = dateParts(now.toISOString())
  if (!anchor || !today) return false
  if (anchor.year !== today.year) return anchor.year > today.year
  if (anchor.month !== today.month) return anchor.month > today.month
  return anchor.day >= today.day
}

export function sortUpcomingEvents<T extends EventDateFields>(events: T[]): T[] {
  return [...events].sort(
    (a, b) => new Date(getEventAnchorDate(a)).getTime() - new Date(getEventAnchorDate(b)).getTime(),
  )
}

export function sortPastEvents<T extends EventDateFields>(events: T[]): T[] {
  return [...events].sort(
    (a, b) => new Date(getEventAnchorDate(b)).getTime() - new Date(getEventAnchorDate(a)).getTime(),
  )
}

export function splitEvents<T extends EventDateFields>(
  events: T[],
  now = new Date(),
): { upcoming: T[]; past: T[] } {
  const upcoming: T[] = []
  const past: T[] = []

  for (const event of events) {
    if (isUpcomingEvent(event, now)) upcoming.push(event)
    else past.push(event)
  }

  return {
    upcoming: sortUpcomingEvents(upcoming),
    past: sortPastEvents(past),
  }
}

const DATE_ZONE = 'America/New_York'

function dateParts(iso: string): { year: number; month: number; day: number } | null {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: DATE_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date)

  const year = Number(parts.find((part) => part.type === 'year')?.value)
  const month = Number(parts.find((part) => part.type === 'month')?.value)
  const day = Number(parts.find((part) => part.type === 'day')?.value)
  if (!year || !month || !day) return null
  return { year, month, day }
}

function formatDay(iso: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: DATE_ZONE, ...options }).format(new Date(iso))
}

function isSameCalendarDay(event: EventDateFields): boolean {
  const start = dateParts(event.startDate)
  if (!start) return true
  const end = event.endDate ? dateParts(event.endDate) : null
  return !end || (end.year === start.year && end.month === start.month && end.day === start.day)
}

export function formatEventDate(event: EventDateFields): string {
  const start = dateParts(event.startDate)
  if (!start) return ''

  if (isSameCalendarDay(event)) {
    return formatDay(event.startDate, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  }

  const startLabel = formatDay(event.startDate, { month: 'short', day: 'numeric' })
  const endLabel = formatDay(event.endDate as string, { month: 'short', day: 'numeric', year: 'numeric' })
  return `${startLabel}–${endLabel}`
}

/** Full date without a time, for the event listing meta line. */
export function formatEventDateLabel(event: EventDateFields): string {
  const start = dateParts(event.startDate)
  if (!start) return ''
  if (!isSameCalendarDay(event)) return formatEventDate(event)
  return formatDay(event.startDate, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

/** Optional clock time. Midnight in America/New_York is treated as an all-day event. */
export function formatEventTimeLabel(event: EventDateFields): string | null {
  if (!isSameCalendarDay(event)) return null
  return formatEventTime(event.startDate)
}

export function eventCtaLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase()
    if (host === 'facebook.com' || host.endsWith('.facebook.com')) return 'See on Facebook'
    if (host === 'eventbrite.com' || host.endsWith('.eventbrite.com')) return 'Get tickets'
    return 'Event details'
  } catch {
    return 'Event details'
  }
}

function formatEventTime(iso: string): string | null {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: DATE_ZONE,
    hour: 'numeric',
    minute: '2-digit',
  }).formatToParts(new Date(iso))

  const hour = parts.find((part) => part.type === 'hour')?.value
  const minute = parts.find((part) => part.type === 'minute')?.value
  const dayPeriod = parts.find((part) => part.type === 'dayPeriod')?.value
  if (hour === '12' && minute === '00' && dayPeriod === 'AM') return null

  return formatDay(iso, { hour: 'numeric', minute: '2-digit' })
}

export function formatEventDay(iso: string): string {
  return formatDay(iso, { day: 'numeric' })
}

export function formatEventMonth(iso: string): string {
  return formatDay(iso, { month: 'short' })
}

export function formatEventWeekday(iso: string): string {
  return formatDay(iso, { weekday: 'short' })
}

