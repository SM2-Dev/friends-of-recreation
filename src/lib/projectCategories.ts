/** Stored in Payload / Postgres. Do not rename these values; existing rows cannot recast onto a new enum. */
export const projectCategories = [
  { label: 'Playground', value: 'playground' },
  { label: 'Facility', value: 'facility' },
  { label: 'Equipment', value: 'equipment' },
  { label: 'Camp', value: 'camp' },
  { label: 'Scholarship', value: 'scholarship' },
  { label: 'Other community project', value: 'other' },
] as const

export type ProjectCategory = (typeof projectCategories)[number]['value']

/** Client-facing groups on /projects-grants. Mapped from stored categories, not a second CMS enum. */
export const publicProjectGroups = [
  { label: 'Facilities', value: 'facilities' },
  { label: 'Youth Programs', value: 'youth-programs' },
  { label: 'Equipment', value: 'equipment' },
  { label: 'Scholarships & Camps', value: 'scholarships-camps' },
  { label: 'Community Projects', value: 'community-projects' },
] as const

export type PublicProjectGroup = (typeof publicProjectGroups)[number]['value']

const toPublicGroup: Record<string, PublicProjectGroup> = {
  playground: 'facilities',
  facility: 'facilities',
  equipment: 'equipment',
  camp: 'scholarships-camps',
  scholarship: 'scholarships-camps',
  other: 'community-projects',
}

export function publicGroupForCategory(category?: string | null): PublicProjectGroup | null {
  if (!category) return null
  return toPublicGroup[category] ?? null
}

export function publicGroupLabel(group: PublicProjectGroup): string {
  return publicProjectGroups.find((item) => item.value === group)?.label ?? group
}
