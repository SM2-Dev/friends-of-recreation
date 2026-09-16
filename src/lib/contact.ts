export type ContactField = 'name' | 'email' | 'phone' | 'subject' | 'message'

export type ContactValues = Record<ContactField, string>

export type ContactFieldErrors = Partial<Record<ContactField, string>>

export const emptyContactValues: ContactValues = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function trimValue(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function readContactValues(formData: FormData): ContactValues {
  return {
    name: trimValue(formData.get('name')),
    email: trimValue(formData.get('email')),
    phone: trimValue(formData.get('phone')),
    subject: trimValue(formData.get('subject')),
    message: trimValue(formData.get('message')),
  }
}

export function honeypotFilled(formData: FormData): boolean {
  return trimValue(formData.get('company')).length > 0
}

export function validateContact(values: ContactValues): ContactFieldErrors {
  const errors: ContactFieldErrors = {}

  if (values.name.length < 2) errors.name = 'Enter your name.'
  else if (values.name.length > 120) errors.name = 'Use 120 characters or fewer.'

  if (!values.email) errors.email = 'Enter your email address.'
  else if (!EMAIL_PATTERN.test(values.email) || values.email.length > 160) {
    errors.email = 'Enter a valid email address.'
  }

  if (values.phone && values.phone.length > 40) {
    errors.phone = 'Use 40 characters or fewer for the phone number.'
  }

  if (values.subject.length < 2) errors.subject = 'Enter a subject.'
  else if (values.subject.length > 160) errors.subject = 'Use 160 characters or fewer.'

  if (values.message.length < 10) errors.message = 'Enter a message of at least 10 characters.'
  else if (values.message.length > 5000) errors.message = 'Use 5,000 characters or fewer.'

  return errors
}
