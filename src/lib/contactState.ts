import { emptyContactValues, type ContactFieldErrors, type ContactValues } from '@/lib/contact'

export type ContactFormState = {
  status: 'idle' | 'error' | 'success'
  values: ContactValues
  fieldErrors: ContactFieldErrors
  formError?: string
}

export const initialContactState: ContactFormState = {
  status: 'idle',
  values: emptyContactValues,
  fieldErrors: {},
}
