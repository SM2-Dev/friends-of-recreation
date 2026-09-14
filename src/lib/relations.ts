import type { Event, Organization, Project } from '@/payload-types'

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

export function isProject(value: unknown): value is Project {
  return isRecord(value) && typeof value.title === 'string' && typeof value.year === 'number'
}

export function isOrganization(value: unknown): value is Organization {
  return isRecord(value) && typeof value.name === 'string'
}

export function isEventDoc(value: unknown): value is Event {
  return isRecord(value) && typeof value.title === 'string' && typeof value.startDate === 'string'
}

export function relatedDocs<T>(value: unknown, guard: (item: unknown) => item is T): T[] {
  if (!Array.isArray(value)) return []
  return value.filter(guard)
}
