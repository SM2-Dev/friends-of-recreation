import type { CollectionConfig } from 'payload'

import { staffField, staffOnly } from '@/access'
import {
  preventPublicInternalWrites,
  stripInternalFieldsForPublic,
} from '@/hooks/stripInternalSubmissionFields'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Contact submission',
    plural: 'Contact submissions',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'subject', 'status', 'createdAt'],
    description: 'Questions from the public contact form. Status and internal notes never appear on the website.',
    group: 'Submissions',
  },
  timestamps: true,
  access: {
    create: () => true,
    read: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  hooks: {
    beforeChange: [preventPublicInternalWrites],
    afterRead: [stripInternalFieldsForPublic],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Optional. Public visitors may leave this blank.',
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      minLength: 10,
      maxLength: 5000,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Closed', value: 'closed' },
      ],
      access: {
        read: staffField,
        update: staffField,
      },
      admin: {
        description: 'Internal workflow only. Never shown publicly.',
      },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      access: {
        read: staffField,
        update: staffField,
      },
      admin: {
        description: 'Staff notes. Never returned to the public site or confirmation screens.',
      },
    },
  ],
}
