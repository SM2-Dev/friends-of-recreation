import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staffOnly } from '@/access'

export const Organizations: CollectionConfig = {
  slug: 'organizations',
  labels: {
    singular: 'Organization',
    plural: 'Organizations',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'website', '_status'],
    description: 'Recreation programs, facilities, and partners that Friends of Recreation supports. Do not invent partners.',
    group: 'Content',
  },
  versions: {
    drafts: true,
  },
  access: {
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
    read: publishedOrStaff,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Optional public website.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional logo. Keep organization logos secondary to photography on the public site.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        description: 'One or two sentences about this program or facility.',
      },
    },
  ],
}
