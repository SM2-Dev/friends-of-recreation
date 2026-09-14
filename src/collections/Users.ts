import type { CollectionConfig } from 'payload'

import { adminField, adminOnly, authenticatedSelfOrAdmin, isAdmin } from '@/access'
import { firstUserAdmin } from '@/hooks/firstUserAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'User',
    plural: 'Users',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
    description: 'Admin accounts can manage users and site settings. Editors manage public content and submissions.',
    group: 'Admin',
    hidden: ({ user }) => !isAdmin(user),
  },
  auth: true,
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: async ({ req }) => {
      if (isAdmin(req.user)) return true
      const existing = await req.payload.find({
        collection: 'users',
        limit: 1,
        overrideAccess: true,
      })
      return existing.totalDocs === 0
    },
    read: authenticatedSelfOrAdmin,
    update: authenticatedSelfOrAdmin,
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [firstUserAdmin],
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        read: ({ req: { user } }) => Boolean(user),
        update: adminField,
      },
      admin: {
        description: 'Admins manage users and settings. Editors manage public content and form submissions.',
      },
    },
  ],
}
