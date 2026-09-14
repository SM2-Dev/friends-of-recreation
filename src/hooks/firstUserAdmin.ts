import type { CollectionBeforeChangeHook } from 'payload'

import { isAdmin } from '@/access'

export const firstUserAdmin: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (operation !== 'create') return data

  const existing = await req.payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
  })

  if (existing.totalDocs === 0) {
    return {
      ...data,
      role: 'admin',
    }
  }

  // Public HTTP create is already blocked once a user exists. Local API seeds may
  // create an admin without a session; only demote when an editor is authenticated.
  if (req.user && !isAdmin(req.user) && data.role === 'admin') {
    return {
      ...data,
      role: 'editor',
    }
  }

  return data
}
