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
