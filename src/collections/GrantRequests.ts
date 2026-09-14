import type { CollectionConfig } from 'payload'

import { staffField, staffOnly } from '@/access'
import {
  preventPublicInternalWrites,
  stripInternalFieldsForPublic,
} from '@/hooks/stripInternalSubmissionFields'

export const GrantRequests: CollectionConfig = {
  slug: 'grant-requests',
  labels: {
    singular: 'Grant request',
    plural: 'Grant requests',
  },
  admin: {
    useAsTitle: 'organizationName',
    defaultColumns: ['organizationName', 'contactName', 'status', 'createdAt'],
    description: 'Grant requests from the public form. Attachments must be PDF. Status and notes are staff-only.',
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
      name: 'organizationName',
      type: 'text',
      required: true,
      label: 'Organization name',
    },
    {
      name: 'contactName',
      type: 'text',
      required: true,
      label: 'Contact name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'projectTitle',
      type: 'text',
      required: true,
      label: 'Project title',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      minLength: 20,
      maxLength: 8000,
      admin: {
        description: 'What the grant would support, who would benefit, and any confirmed details.',
      },
    },
    {
      name: 'amountRequested',
      type: 'text',
      label: 'Amount requested',
      admin: {
        description: 'Optional. Use a dollar amount or a short description such as equipment only.',
      },
    },
    {
      name: 'attachment',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: {
          equals: 'application/pdf',
        },
      },
      admin: {
        description: 'Optional PDF only. Stored as an internal file and never shown on the public site.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'In review', value: 'in-review' },
        { label: 'Awarded', value: 'awarded' },
        { label: 'Declined', value: 'declined' },
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
