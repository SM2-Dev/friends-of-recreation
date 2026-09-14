import type { CollectionConfig } from 'payload'

import { isStaff, staffOnly } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media item',
    plural: 'Media',
  },
  admin: {
    description:
      'Photographs and files for the public site. Grant PDFs are stored as internal files and are never shown publicly. Production should use object storage via S3 environment variables.',
    group: 'Content',
    defaultColumns: ['filename', 'alt', 'visibility', 'mimeType'],
  },
  access: {
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
    read: ({ req: { user } }) => {
      if (isStaff(user)) return true
      return {
        visibility: {
          equals: 'public',
        },
      }
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.mimeType === 'application/pdf') {
          return {
            ...data,
            visibility: 'internal',
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for screen readers. Required for every file, including decorative photos.',
      },
    },
    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      required: true,
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Internal (not shown on the website)', value: 'internal' },
      ],
      admin: {
        description: 'Internal files, including grant PDFs, are never returned to the public website.',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 900,
        height: 675,
        position: 'centre',
      },
      {
        name: 'feature',
        width: 1600,
        height: 1200,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 2400,
        height: 1600,
        position: 'centre',
      },
    ],
  },
}
