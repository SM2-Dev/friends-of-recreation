import type { CollectionConfig } from 'payload'

import { isStaff, staffOnly } from '@/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidatePublic'
import { validateMediaAlt } from '@/lib/mediaAlt'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media item',
    plural: 'Media',
  },
  admin: {
    description:
      'Photographs and files for the public site. Grant PDFs are stored as internal files and are never shown publicly. Production stores files in Vercel Blob.',
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
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
    beforeChange: [
      ({ data }) => {
        if (data?.mimeType === 'application/pdf') {
          return {
            ...data,
            visibility: 'internal',
            decorative: false,
            alt: data.alt || 'Grant request PDF',
          }
        }

        if (data?.decorative) {
          return {
            ...data,
            alt: typeof data.alt === 'string' ? data.alt : '',
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
      maxLength: 500,
      admin: {
        description:
          'Required for meaningful photographs. Describe the activity, people, and place. Leave blank only for PDFs or images marked decorative.',
        condition: (_, siblingData) => siblingData?.mimeType !== 'application/pdf' && !siblingData?.decorative,
      },
      validate: (
        value: unknown,
        { data, siblingData }: { data?: Record<string, unknown>; siblingData?: Record<string, unknown> },
      ) => {
        const source = { ...data, ...siblingData } as {
          mimeType?: string | null
          decorative?: boolean | null
        }
        return validateMediaAlt(value, source)
      },
    },
    {
      name: 'decorative',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Use for logos or purely decorative crops. The public site will use empty alt text so screen readers skip the image.',
        condition: (_, siblingData) => siblingData?.mimeType !== 'application/pdf',
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
    disableLocalStorage: Boolean(process.env.VERCEL),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        withoutEnlargement: true,
      },
      {
        name: 'card',
        width: 900,
        height: 675,
        position: 'centre',
        withoutEnlargement: true,
      },
      {
        name: 'feature',
        width: 1600,
        height: 1200,
        position: 'centre',
        withoutEnlargement: true,
      },
      {
        name: 'hero',
        width: 2400,
        height: 1600,
        position: 'centre',
        withoutEnlargement: true,
      },
    ],
  },
}
