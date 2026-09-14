import type { GlobalConfig } from 'payload'

import { anyone, staffOnly } from '@/access'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  admin: {
    description: 'Homepage mission, featured projects, and contact intro. Editors can update this content.',
    group: 'Pages',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: anyone,
    update: staffOnly,
  },
  fields: [
    {
      name: 'missionHeading',
      type: 'text',
      required: true,
      defaultValue: 'Building More Opportunities to Play in Saratoga Springs.',
      admin: {
        description: 'Starter wording until the board approves final language. Keep it short enough to stay on the first screen with Donate.',
      },
    },
    {
      name: 'missionBody',
      type: 'textarea',
      required: true,
      admin: {
        description: 'One or two sentences explaining the mission in plain language.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Large authentic recreation photograph. Leave empty until approved photography is available.',
      },
    },
    {
      name: 'heroImagePosition',
      type: 'text',
      defaultValue: 'center',
      admin: {
        description: 'CSS object-position, such as center or 30% 40%, so faces stay in crop.',
      },
    },
    {
      name: 'featuredProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      maxRows: 4,
      admin: {
        description: 'Three to four featured projects. Leave empty rather than adding unconfirmed examples.',
      },
    },
    {
      name: 'featuredOrganizations',
      type: 'relationship',
      relationTo: 'organizations',
      hasMany: true,
      admin: {
        description: 'Supported programs and facilities to highlight on the homepage.',
      },
    },
    {
      name: 'contactIntro',
      type: 'textarea',
      admin: {
        description: 'Short intro above the homepage contact form.',
      },
    },
  ],
}
