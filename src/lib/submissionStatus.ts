import type { Field } from 'payload'

import { staffField } from '@/access'

export const SUBMISSION_STATUS_OPTIONS = [
  { label: 'New', value: 'new' },
  { label: 'Reviewing', value: 'reviewing' },
  { label: 'Follow Up', value: 'follow-up' },
  { label: 'Approved', value: 'approved' },
  { label: 'Declined', value: 'declined' },
  { label: 'Closed', value: 'closed' },
] as const

export type SubmissionStatus = (typeof SUBMISSION_STATUS_OPTIONS)[number]['value']

export const submissionStatusField = (): Field => ({
  name: 'status',
  type: 'select',
  defaultValue: 'new',
  required: true,
  options: [...SUBMISSION_STATUS_OPTIONS],
  access: {
    read: staffField,
    update: staffField,
  },
  admin: {
    description: 'Internal workflow only. Never shown publicly.',
  },
})
