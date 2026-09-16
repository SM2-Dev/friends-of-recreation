import type { CollectionConfig } from 'payload'

import { staffField, staffOnly } from '@/access'
import {
  preventPublicInternalWrites,
  stripInternalFieldsForPublic,
} from '@/hooks/stripInternalSubmissionFields'
import { submissionStatusField } from '@/lib/submissionStatus'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Contact submission',
    plural: 'Contact submissions',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'subject', 'status', 'createdAt'],
    description: 'Questions from the public contact form. Status and internal notes never appear on the website. The public form creates records through a server action; the REST API is staff-only.',
    group: 'Submissions',
  },
  timestamps: true,
  access: {
    create: staffOnly,
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
    submissionStatusField(),
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
