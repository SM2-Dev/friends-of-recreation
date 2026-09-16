export type GrantField =
  | 'organizationName'
  | 'contactName'
  | 'email'
  | 'phone'
  | 'website'
  | 'amountRequested'
  | 'projectTitle'
  | 'beneficiaries'
  | 'request'
  | 'recreationImpact'
  | 'requestedTimeline'

export type GrantValues = Record<GrantField, string>

export type GrantFieldErrors = Partial<Record<GrantField, string>>

export const emptyGrantValues: GrantValues = {
  organizationName: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  amountRequested: '',
  projectTitle: '',
  beneficiaries: '',
  request: '',
  recreationImpact: '',
  requestedTimeline: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function trimValue(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function readGrantValues(formData: FormData): GrantValues {
  return {
    organizationName: trimValue(formData.get('organizationName')),
    contactName: trimValue(formData.get('contactName')),
    email: trimValue(formData.get('email')),
    phone: trimValue(formData.get('phone')),
    website: trimValue(formData.get('website')),
    amountRequested: trimValue(formData.get('amountRequested')),
    projectTitle: trimValue(formData.get('projectTitle')),
    beneficiaries: trimValue(formData.get('beneficiaries')),
    request: trimValue(formData.get('request')),
    recreationImpact: trimValue(formData.get('recreationImpact')),
    requestedTimeline: trimValue(formData.get('requestedTimeline')),
  }
}

export function validateGrant(values: GrantValues): GrantFieldErrors {
  const errors: GrantFieldErrors = {}

  if (values.organizationName.length < 2) errors.organizationName = 'Enter the organization or group name.'
  else if (values.organizationName.length > 160) errors.organizationName = 'Use 160 characters or fewer.'

  if (values.contactName.length < 2) errors.contactName = 'Enter a contact name.'
  else if (values.contactName.length > 120) errors.contactName = 'Use 120 characters or fewer.'

  if (!values.email) errors.email = 'Enter an email address.'
  else if (!EMAIL_PATTERN.test(values.email) || values.email.length > 160) {
    errors.email = 'Enter a valid email address.'
  }

  if (values.phone && values.phone.length > 40) errors.phone = 'Use 40 characters or fewer.'
  if (values.website && values.website.length > 300) errors.website = 'Use 300 characters or fewer.'
  if (values.amountRequested.length > 120) errors.amountRequested = 'Use 120 characters or fewer.'

  if (values.projectTitle.length < 2) errors.projectTitle = 'Enter the project or program name.'
  else if (values.projectTitle.length > 200) errors.projectTitle = 'Use 200 characters or fewer.'

  if (values.request.length < 20) errors.request = 'Tell us about the request in at least 20 characters.'
  else if (values.request.length > 8000) errors.request = 'Use 8,000 characters or fewer.'

  if (values.beneficiaries.length > 2000) errors.beneficiaries = 'Use 2,000 characters or fewer.'
  if (values.recreationImpact.length > 2000) errors.recreationImpact = 'Use 2,000 characters or fewer.'
  if (values.requestedTimeline.length > 200) errors.requestedTimeline = 'Use 200 characters or fewer.'

  return errors
}
