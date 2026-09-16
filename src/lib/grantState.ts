import { emptyGrantValues, type GrantFieldErrors, type GrantValues } from '@/lib/grant'

export type GrantFormState = {
  status: 'idle' | 'error' | 'success'
  values: GrantValues
  fieldErrors: GrantFieldErrors
  formError?: string
}

export const initialGrantState: GrantFormState = {
  status: 'idle',
  values: emptyGrantValues,
  fieldErrors: {},
}
