import type { CollectionAfterReadHook, CollectionBeforeChangeHook } from 'payload'

import { isStaff } from '@/access'

const INTERNAL_FIELDS = ['internalNotes', 'status'] as const

export const preventPublicInternalWrites: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  if (isStaff(req.user)) return data

  if (operation === 'create') {
    return {
      ...data,
      status: 'new',
      internalNotes: '',
    }
  }

  const next = { ...data }
  delete next.status
  delete next.internalNotes
  return next
}

export const stripInternalFieldsForPublic: CollectionAfterReadHook = ({ doc, req }) => {
  if (isStaff(req.user)) return doc

  const next = { ...doc }
  for (const field of INTERNAL_FIELDS) {
    delete next[field]
  }
  return next
}
