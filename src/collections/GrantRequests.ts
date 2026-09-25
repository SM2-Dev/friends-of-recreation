import type { CollectionConfig } from 'payload'

import { staffField, staffOnly } from '@/access'
import {
  preventPublicInternalWrites,
  stripInternalFieldsForPublic,
} from '@/hooks/stripInternalSubmissionFields'
import { submissionStatusField } from '@/lib/submissionStatus'

export const GrantRequests: CollectionConfig = {
  slug: 'grant-requests',
  labels: {
    singular: 'Grant request',
    plural: 'Grant requests',
  },
  admin: {
    useAsTitle: 'organizationName',
    defaultColumns: ['organizationName', 'contactName', 'status', 'createdAt'],
    description: 'Grant requests from the public form. Attachments must be PDF. Status and notes are staff-only. The public form creates records through a server action; the REST API is staff-only.',
    group: 'Form submissions',
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
      name: 'organizationName',
      type: 'text',
      required: true,
      label: 'Organization / group name',
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
      required: true,
    },
    {
      name: 'website',
      type: 'text',
      label: 'Organization website',
      admin: {
        description: 'Optional public website for the requesting group.',
      },
    },
    {
      name: 'projectTitle',
      type: 'text',
      required: true,
      label: 'Project / program name',
    },
    {
      name: 'beneficiaries',
      type: 'textarea',
      label: 'Who will this project benefit?',
    },
    {
      name: 'recreationImpact',
      type: 'textarea',
      label: 'How will this improve recreation in Saratoga Springs?',
    },
    {
      name: 'requestedTimeline',
      type: 'text',
      label: 'Requested funding date or project timeline',
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
