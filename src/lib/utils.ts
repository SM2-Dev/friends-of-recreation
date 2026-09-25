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

/**
 * next/image treats an absolute URL as remote even when it points at this app.
 * Local Payload media is stored as http://localhost:3000/api/media/file/...,
 * which then 500s unless we pass the path so `images.localPatterns` can match.
 */
export function toNextImageSrc(url: string): string {
  if (url.startsWith('/')) return url
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname === '::1') {
      return `${parsed.pathname}${parsed.search}`
    }
  } catch {
    return url
  }
  return url
}
