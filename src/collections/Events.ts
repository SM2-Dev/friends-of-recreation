import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staffOnly } from '@/access'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'endDate', 'cancelled', '_status'],
    description:
      'Upcoming versus past is determined by end date, or start date when no end date exists. Upcoming sorts soonest first; past sorts newest first.',
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Start of the event. Used to decide upcoming versus past when there is no end date.',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Optional. When present, this date decides whether the event is still upcoming.',
      },
      validate: (value, { data }) => {
        const startDate = (data as { startDate?: string } | undefined)?.startDate
        if (value && startDate && new Date(value).getTime() < new Date(startDate).getTime()) {
          return 'End date must be on or after the start date.'
        }
        return true
      },
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        description: 'Optional link for tickets, Facebook, or more information. Opens as an external link on the site.',
      },
    },
    {
      name: 'cancelled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Cancelled events still appear, clearly marked, instead of disappearing.',
      },
    },
  ],
}
