import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staffOnly } from '@/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidatePublic'
import { projectCategories } from '@/lib/projectCategories'

export { projectCategories } from '@/lib/projectCategories'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Project',
    plural: 'Projects',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'category', 'amountLabel', '_status'],
    description:
      'Funded projects and grants. Record year, amount or funding detail, recipient, and who benefited. Do not invent amounts or outcomes.',
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
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      admin: {
        description: 'The year this project was funded or completed.',
      },
      validate: (value: number | null | undefined) => {
        if (typeof value !== 'number') return 'Enter a year.'
        if (value < 1980 || value > 2100) return 'Enter a four-digit year.'
        return true
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [...projectCategories],
      admin: {
        description:
          'Stored as playground, facility, equipment, camp, scholarship, or other. The public Projects & Grants page groups these into the five client categories.',
      },
    },
    {
      name: 'amountLabel',
      type: 'text',
      admin: {
        description: 'Public funding detail, such as $5,000 or in-kind equipment. Leave blank if the amount is not confirmed.',
      },
    },
    {
      name: 'recipient',
      type: 'text',
      admin: {
        description: 'Who received the funds or equipment.',
      },
    },
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      admin: {
        description: 'Optional link to a supported organization or facility.',
      },
    },
    {
      name: 'beneficiaries',
      type: 'text',
      admin: {
        description: 'Who benefited, in plain language.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short public description. Be specific and do not invent outcomes.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show this project in Featured projects sections. Up to four, newest first.',
      },
    },
  ],
}
