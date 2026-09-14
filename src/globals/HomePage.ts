import type { GlobalConfig } from 'payload'

import { anyone, staffOnly } from '@/access'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  admin: {
    description: 'Homepage mission, impact, featured projects, donation copy, and contact intro. Editors can update this content.',
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
      type: 'collapsible',
      label: 'Mission and hero',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'missionHeading',
          type: 'text',
          required: true,
          defaultValue: 'Building More Opportunities to Play in Saratoga Springs.',
          admin: {
            description:
              'Starter wording until the board approves final language. Keep it short enough to stay on the first screen with Donate.',
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
      ],
    },
    {
      type: 'collapsible',
      label: 'Community impact',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'impactHeading',
          type: 'text',
          defaultValue: 'Community impact',
        },
        {
          name: 'impactIntro',
          type: 'textarea',
          admin: {
            description: 'Optional. Keep this to how Friends of Recreation helps, not invented outcomes.',
          },
        },
        {
          name: 'impactStories',
          type: 'array',
          maxRows: 3,
          admin: {
            description:
              'Up to three impact stories. They are typeset on one field at unequal scale, not as three matching cards. Leave empty rather than inventing results.',
          },
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
            },
            {
              name: 'body',
              type: 'textarea',
              required: true,
            },
            {
              name: 'proofLabel',
              type: 'text',
              admin: {
                description: 'Optional inscribed proof, such as a year, amount, or recipient. Leave blank if unconfirmed.',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Featured content',
      fields: [
        {
          name: 'organizationsHeading',
          type: 'text',
          defaultValue: 'Supported programs and facilities',
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
          name: 'projectsHeading',
          type: 'text',
          defaultValue: 'Featured projects and grants',
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
      ],
    },
    {
      type: 'collapsible',
      label: 'Donate and contact',
      fields: [
        {
          name: 'donationHeading',
          type: 'text',
          defaultValue: 'Help more kids play here',
        },
        {
          name: 'donationBody',
          type: 'textarea',
          admin: {
            description: 'Short donation reprise. Do not invent a payment processor or URL.',
          },
        },
        {
          name: 'contactHeading',
          type: 'text',
          defaultValue: 'Ask a question',
        },
        {
          name: 'contactIntro',
          type: 'textarea',
          admin: {
            description: 'Short intro above the homepage contact form.',
          },
        },
      ],
    },
  ],
}
