export type EventDateFields = {
  startDate: string
  endDate?: string | null
  cancelled?: boolean | null
}

export function getEventAnchorDate(event: EventDateFields): string {
  return event.endDate || event.startDate
}

export function isUpcomingEvent(event: EventDateFields, now = new Date()): boolean {
  const anchor = new Date(getEventAnchorDate(event))
  return !Number.isNaN(anchor.getTime()) && anchor.getTime() >= now.getTime()
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

export function formatEventDate(event: EventDateFields): string {
  const start = dateParts(event.startDate)
  if (!start) return ''

  const end = event.endDate ? dateParts(event.endDate) : null
  const sameDay = !end || (end.year === start.year && end.month === start.month && end.day === start.day)

  if (sameDay) {
    return formatDay(event.startDate, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  }

  const startLabel = formatDay(event.startDate, { month: 'short', day: 'numeric' })
  const endLabel = formatDay(event.endDate as string, { month: 'short', day: 'numeric', year: 'numeric' })
  return `${startLabel}–${endLabel}`
}

export function formatEventDay(iso: string): string {
  return formatDay(iso, { day: 'numeric' })
}

export function formatEventMonth(iso: string): string {
  return formatDay(iso, { month: 'short' })
}

