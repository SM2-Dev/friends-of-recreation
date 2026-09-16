import { describe, expect, it } from 'vitest'

import { imageAltText, validateMediaAlt } from '@/lib/mediaAlt'

describe('media alt text', () => {
  it('requires a description for meaningful photographs', () => {
    expect(validateMediaAlt('', { mimeType: 'image/jpeg' })).toBe(
      'Describe this photograph for screen readers, or mark it as decorative.',
    )
    expect(validateMediaAlt('Kids playing at Veterans Memorial Park', { mimeType: 'image/jpeg' })).toBe(true)
  })

  it('allows empty alt for decorative images and PDFs', () => {
    expect(validateMediaAlt('', { decorative: true, mimeType: 'image/png' })).toBe(true)
    expect(validateMediaAlt('', { mimeType: 'application/pdf' })).toBe(true)
  })

  it('renders empty alt text for decorative images on the public site', () => {
    expect(imageAltText({ alt: 'Friends of Recreation logo', decorative: true })).toBe('')
    expect(imageAltText({ alt: 'A scoreboard at Vernon Ice Rink' })).toBe('A scoreboard at Vernon Ice Rink')
  })
})
