import { describe, expect, it } from 'vitest'

import { GRANT_PDF_MAX_BYTES, readGrantPdf, validateGrant, validateGrantPdf } from '@/lib/grant'
import { verifyTurnstile } from '@/lib/turnstile'

function form(entries: Record<string, string>, file?: File): FormData {
  const data = new FormData()
  for (const [key, value] of Object.entries(entries)) data.set(key, value)
  if (file) data.set('attachment', file)
  return data
}

describe('grant request validation', () => {
  it('accepts a complete request without an attachment', () => {
    const values = {
      organizationName: 'Camp Saradac',
      contactName: 'Alex Rivera',
      email: 'alex@example.com',
      phone: '518-555-0100',
      website: '',
      amountRequested: '',
      projectTitle: 'Camp scholarships',
      beneficiaries: '',
      request: 'We would like help funding camp scholarships for local families.',
      recreationImpact: '',
      requestedTimeline: '',
    }

    expect(validateGrant(values)).toEqual({})
    expect(validateGrantPdf(null)).toBeUndefined()
  })

  it('requires a phone number', () => {
    const values = {
      organizationName: 'Camp Saradac',
      contactName: 'Alex Rivera',
      email: 'alex@example.com',
      phone: '',
      website: '',
      amountRequested: '',
      projectTitle: 'Camp scholarships',
      beneficiaries: '',
      request: 'We would like help funding camp scholarships for local families.',
      recreationImpact: '',
      requestedTimeline: '',
    }

    expect(validateGrant(values).phone).toBe('Enter a phone number.')
  })

  it('rejects non-PDF attachments and oversized files', () => {
    const photo = new File(['not-a-pdf'], 'photo.png', { type: 'image/png' })
    expect(validateGrantPdf(photo)).toBe('Attach a PDF only.')

    const huge = new File(['%PDF'], 'budget.pdf', { type: 'application/pdf' })
    Object.defineProperty(huge, 'size', { value: GRANT_PDF_MAX_BYTES + 1 })
    expect(validateGrantPdf(huge)).toBe('Keep the PDF under 8 MB.')
  })

  it('reads an optional PDF from the form', () => {
    const pdf = new File(['%PDF'], 'budget.pdf', { type: 'application/pdf' })
    expect(readGrantPdf(form({}, pdf))?.name).toBe('budget.pdf')
    expect(readGrantPdf(form({}))).toBeNull()
  })
})

describe('turnstile', () => {
  it('skips verification when keys are not configured', async () => {
    await expect(verifyTurnstile(form({}))).resolves.toBe(true)
  })
})
