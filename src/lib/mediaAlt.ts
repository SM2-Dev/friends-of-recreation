type MediaAltInput = {
  mimeType?: string | null
  decorative?: boolean | null
}

export function isPdfUpload(mimeType?: string | null): boolean {
  return mimeType === 'application/pdf'
}

export function validateMediaAlt(
  value: unknown,
  data: MediaAltInput = {},
): true | string {
  if (isPdfUpload(data.mimeType)) return true
  if (data.decorative) return true
  if (typeof value !== 'string' || !value.trim()) {
    return 'Describe this photograph for screen readers, or mark it as decorative.'
  }
  return true
}

export function imageAltText(
  media: { alt?: string | null; decorative?: boolean | null } | null | undefined,
  decorative = false,
): string {
  if (!media || decorative || media.decorative) return ''
  return media.alt?.trim() || ''
}
