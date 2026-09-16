import type { Media, Project } from '@/payload-types'
import {
  publicGroupForCategory,
  publicGroupLabel,
  type PublicProjectGroup,
} from '@/lib/projectCategories'
import { isMedia } from '@/lib/utils'

export type HomePhoto = {
  media: Media
  position: string
}

function slotImage(value: unknown): Media | null {
  if (!value || typeof value !== 'object' || !('image' in value)) return null
  const image = value.image
  return isMedia(image) && image.url ? image : null
}

function slotPosition(value: unknown, fallback = 'center'): string {
  if (!value || typeof value !== 'object' || !('position' in value)) return fallback
  return typeof value.position === 'string' && value.position.trim() ? value.position : fallback
}

/** Hero plates: 1–3 CMS photographs, with a single fallback image if the list is empty. */
export function heroPhotosFrom(block: {
  photos?: unknown
  fallbackImage?: unknown
  fallbackImagePosition?: string | null
}): HomePhoto[] {
  const slots = Array.isArray(block.photos) ? block.photos : []
  const photos: HomePhoto[] = []

  for (const slot of slots) {
    if (photos.length >= 3) break
    const media = slotImage(slot)
    if (!media) continue
    photos.push({ media, position: slotPosition(slot) })
  }

  if (photos.length > 0) return photos

  if (isMedia(block.fallbackImage) && block.fallbackImage.url) {
    return [{ media: block.fallbackImage, position: block.fallbackImagePosition || 'center' }]
  }

  return []
}

/** Photo-rail slides. Empty until editors add them — never a dump of the media library. */
export function sliderPhotosFrom(block: { slides?: unknown }): Media[] {
  if (!Array.isArray(block.slides)) return []
  return block.slides.map(slotImage).filter((photo): photo is Media => Boolean(photo))
}

/** A bare dollar figure can carry display weight. A sentence cannot. */
export function isPlainAmount(amount?: string | null): boolean {
  if (!amount) return false
  return /^\$?[\d,]+(\.\d{2})?\+?$/.test(amount.trim())
}

export type PlainAmount = {
  prefix: string
  value: number
  fractionDigits: 0 | 2
  suffix: string
}

export function parsePlainAmount(amount?: string | null): PlainAmount | null {
  if (!amount || !isPlainAmount(amount)) return null

  const trimmed = amount.trim()
  const prefix = trimmed.startsWith('$') ? '$' : ''
  const suffix = trimmed.endsWith('+') ? '+' : ''
  const numeric = trimmed.slice(prefix ? 1 : 0, suffix ? -1 : undefined).replace(/,/g, '')
  const value = Number(numeric)
  if (!Number.isFinite(value)) return null

  return {
    prefix,
    value,
    fractionDigits: numeric.includes('.') ? 2 : 0,
    suffix,
  }
}

export function formatPlainAmount(amount: PlainAmount, current: number): string {
  const value = amount.fractionDigits === 2 ? current : Math.round(current)
  return `${amount.prefix}${value.toLocaleString('en-US', {
    minimumFractionDigits: amount.fractionDigits,
    maximumFractionDigits: amount.fractionDigits,
  })}${amount.suffix}`
}

/**
 * Facts we are allowed to state: they are literally present in the data.
 * Totals and beneficiary counts are deliberately not derived here.
 */
export function projectSpan(projects: Project[]): { first: number; latest: number; count: number } | null {
  const years = projects.map((project) => project.year).filter((year): year is number => typeof year === 'number')
  if (years.length === 0) return null

  return {
    first: Math.min(...years),
    latest: Math.max(...years),
    count: projects.length,
  }
}

export function categoryLabel(category?: string | null): string | null {
  const group = publicGroupForCategory(category)
  return group ? publicGroupLabel(group) : null
}

export function groupProjectsByYear(projects: Project[]): Array<{ year: number; projects: Project[] }> {
  const groups: Array<{ year: number; projects: Project[] }> = []

  for (const project of projects) {
    const last = groups[groups.length - 1]
    if (last && last.year === project.year) {
      last.projects.push(project)
    } else {
      groups.push({ year: project.year, projects: [project] })
    }
  }

  return groups
}

export function latestProjectInCategory(
  projects: Project[],
  group: PublicProjectGroup,
): Project | null {
  return projects.find((project) => publicGroupForCategory(project.category) === group) ?? null
}

/** Split an inscribed proof line on middots so named places can stack and scan. */
export function proofItems(label?: string | null): string[] {
  if (!label?.trim()) return []
  return label
    .split(/\s*·\s*/)
    .map((item) => item.trim())
    .filter(Boolean)
}
