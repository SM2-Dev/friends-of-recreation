import type { Media, Project } from '@/payload-types'
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

/** Hero plates from the Home page global: 1–3 CMS photographs, with the old single image as fallback. */
export function homeHeroPhotos(home: {
  heroPhotos?: unknown
  heroImage?: unknown
  heroImagePosition?: string | null
}): HomePhoto[] {
  const slots = Array.isArray(home.heroPhotos) ? home.heroPhotos : []
  const photos: HomePhoto[] = []

  for (const slot of slots) {
    if (photos.length >= 3) break
    const media = slotImage(slot)
    if (!media) continue
    photos.push({ media, position: slotPosition(slot) })
  }

  if (photos.length > 0) return photos

  if (isMedia(home.heroImage) && home.heroImage.url) {
    return [{ media: home.heroImage, position: home.heroImagePosition || 'center' }]
  }

  return []
}

/** Homepage slider photographs. Empty until editors add them — never a dump of the media library. */
export function homeSliderPhotos(home: { photoSlider?: unknown }): Media[] {
  if (!Array.isArray(home.photoSlider)) return []
  return home.photoSlider.map(slotImage).filter((photo): photo is Media => Boolean(photo))
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

export const projectCategoryLabels: Record<string, string> = {
  playground: 'Playground',
  facility: 'Facility',
  equipment: 'Equipment',
  camp: 'Camp',
  scholarship: 'Scholarship',
  other: 'Community project',
}

export function categoryLabel(category?: string | null): string | null {
  if (!category) return null
  return projectCategoryLabels[category] ?? null
}

/** Split an inscribed proof line on middots so named places can stack and scan. */
export function proofItems(label?: string | null): string[] {
  if (!label?.trim()) return []
  return label
    .split(/\s*·\s*/)
    .map((item) => item.trim())
    .filter(Boolean)
}
