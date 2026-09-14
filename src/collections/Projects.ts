import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staffOnly } from '@/access'

export const projectCategories = [
  { label: 'Playground', value: 'playground' },
  { label: 'Facility', value: 'facility' },
  { label: 'Equipment', value: 'equipment' },
  { label: 'Camp', value: 'camp' },
  { label: 'Scholarship', value: 'scholarship' },
  { label: 'Other community project', value: 'other' },
] as const

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
        description: 'Used to group projects without forcing every story into the same card layout.',
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
        description: 'Featured projects can be selected on the homepage.',
      },
    },
  ],
}
