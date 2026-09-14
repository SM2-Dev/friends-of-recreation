import { describe, expect, it } from 'vitest'

import { honeypotFilled, readContactValues, validateContact } from '@/lib/contact'

function form(entries: Record<string, string>): FormData {
  const data = new FormData()
  for (const [key, value] of Object.entries(entries)) data.set(key, value)
  return data
}

describe('contact form validation', () => {
  it('requires name, email, subject, and a long enough message', () => {
    const values = readContactValues(form({}))
    const errors = validateContact(values)

    expect(errors.name).toBe('Enter your name.')
    expect(errors.email).toBe('Enter your email address.')
    expect(errors.subject).toBe('Enter a subject.')
    expect(errors.message).toBe('Enter a message of at least 10 characters.')
    expect(errors.phone).toBeUndefined()
  })

  it('accepts a complete submission with optional phone omitted', () => {
    const values = readContactValues(
      form({
        name: 'Alex Rivera',
        email: 'alex@example.com',
        subject: 'Scholarship question',
        message: 'How do families ask about camp scholarships?',
      }),
    )

    expect(validateContact(values)).toEqual({})
  })

  it('treats a filled honeypot as spam', () => {
    expect(honeypotFilled(form({ company: 'bot' }))).toBe(true)
    expect(honeypotFilled(form({ company: '' }))).toBe(false)
  })
})
