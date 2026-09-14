import { describe, expect, it } from 'vitest'

import { isUpcomingEvent, formatEventDate, sortPastEvents, sortUpcomingEvents, splitEvents } from '@/lib/events'

describe('event date logic', () => {
  const now = new Date('2026-09-14T12:00:00.000Z')

  it('uses endDate when present to decide upcoming versus past', () => {
    expect(
      isUpcomingEvent({ startDate: '2026-09-01T12:00:00.000Z', endDate: '2026-09-20T12:00:00.000Z' }, now),
    ).toBe(true)

    expect(
      isUpcomingEvent({ startDate: '2026-08-01T12:00:00.000Z', endDate: '2026-09-01T12:00:00.000Z' }, now),
    ).toBe(false)
  })

  it('falls back to startDate when there is no end date', () => {
    expect(isUpcomingEvent({ startDate: '2026-09-15T12:00:00.000Z' }, now)).toBe(true)
    expect(isUpcomingEvent({ startDate: '2026-09-13T12:00:00.000Z' }, now)).toBe(false)
  })

  it('sorts upcoming ascending and past descending', () => {
    const events = [
      { title: 'Later', startDate: '2026-10-01T12:00:00.000Z' },
      { title: 'Soon', startDate: '2026-09-16T12:00:00.000Z' },
      { title: 'Old', startDate: '2026-08-01T12:00:00.000Z' },
      { title: 'Older', startDate: '2026-07-01T12:00:00.000Z' },
    ]

    const { upcoming, past } = splitEvents(events, now)

    expect(sortUpcomingEvents(upcoming).map((event) => event.title)).toEqual(['Soon', 'Later'])
    expect(sortPastEvents(past).map((event) => event.title)).toEqual(['Old', 'Older'])
  })

  it('formats a single day and a date range', () => {
    expect(formatEventDate({ startDate: '2026-09-20T16:00:00.000Z' })).toMatch(/Sep/)
    expect(
      formatEventDate({
        startDate: '2026-09-20T16:00:00.000Z',
        endDate: '2026-09-21T16:00:00.000Z',
      }),
    ).toMatch(/–/)
  })
})
