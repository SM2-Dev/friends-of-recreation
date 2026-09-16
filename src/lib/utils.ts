import type { Media } from '@/payload-types'

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function isMedia(value: unknown): value is Media {
  return Boolean(value && typeof value === 'object' && 'url' in value)
}

export function mediaUrl(value: unknown): string | null {
  if (!isMedia(value) || !value.url) return null
  return value.url
}
