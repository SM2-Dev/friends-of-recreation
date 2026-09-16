import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staffOnly } from '@/access'
import { pageLayoutBlocks } from '@/blocks/pageLayout'
import { slugify, validatePageSlug } from '@/lib/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description:
      'Create a page, then add and reorder the designed sections that make it up. Drag sections to change their order.',
    group: 'Pages',
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
        const doc = await req.payload.findByID({
          collection: 'pages',
          id,
          depth: 0,
          overrideAccess: true,
        })
        if (doc.slug === 'home') {
          throw new Error('The home page cannot be deleted. Unpublish it or edit its sections instead.')
        }
      },
    ],
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
      admin: {
        description: 'Used in the admin list, browser tab, and navigation unless you set a nav label.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          'URL path. Use home for the homepage at /. Other pages become /your-slug, such as board-members.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (typeof value === 'string' && value.trim()) return slugify(value)
            if (typeof data?.title === 'string') return slugify(data.title)
            return value
          },
        ],
      },
      validate: (value: unknown) => validatePageSlug(value),
    },
    {
      name: 'layout',
      type: 'blocks',
      labels: {
        singular: 'Section',
        plural: 'Sections',
      },
      blocks: pageLayoutBlocks,
      admin: {
        description: 'Add a section, then drag it to the place it should appear on the public page.',
        initCollapsed: false,
      },
    },
    {
      type: 'collapsible',
      label: 'Navigation and search listing',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'showInNav',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show this page in the header and footer.',
          },
        },
        {
          name: 'navLabel',
          type: 'text',
          admin: {
            description: 'Optional shorter label for the navigation. Defaults to the page title.',
            condition: (_, siblingData) => Boolean(siblingData?.showInNav),
          },
        },
        {
          name: 'navOrder',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Lower numbers appear first. Home is usually 0.',
            condition: (_, siblingData) => Boolean(siblingData?.showInNav),
          },
        },
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Optional browser-tab title. Defaults to the page title.',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'Optional search listing description.',
          },
        },
      ],
    },
  ],
}
