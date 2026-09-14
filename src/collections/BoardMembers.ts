import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staffOnly } from '@/access'

export const BoardMembers: CollectionConfig = {
  slug: 'board-members',
  labels: {
    singular: 'Board member',
    plural: 'Board members',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', '_status'],
    description: 'Current volunteer board members. Leave fields empty rather than inventing titles or bios.',
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
      name: 'title',
      type: 'text',
      admin: {
        description: 'Board role, such as President or Member. Optional.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional headshot. The public site works without a photo.',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Short optional biography. Do not invent personal details.',
      },
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Optional public link.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first.',
      },
    },
  ],
}
