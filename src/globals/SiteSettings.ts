import type { GlobalConfig } from 'payload'

import { adminOnly, anyone, staffField } from '@/access'
import { revalidateAfterGlobalChange } from '@/hooks/revalidatePublic'
import { DEFAULT_DESCRIPTION } from '@/lib/site'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    description: 'Site-wide name, donation link, and contact details. Admins manage these settings.',
    group: 'Website',
  },
  access: {
    read: anyone,
    update: adminOnly,
  },
  hooks: {
    afterChange: [revalidateAfterGlobalChange],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Friends of Recreation',
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Optional short line used near the logo. Keep it concrete.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Approved Friends of Recreation logo. Required before final brand colors are sampled.',
      },
    },
    {
      name: 'donationUrl',
      type: 'text',
      admin: {
        description: 'External donation page. Leave blank until the board confirms the URL. The site will not invent a payment link.',
      },
    },
    {
      name: 'donationLabel',
      type: 'text',
      defaultValue: 'Donate',
      admin: {
        description: 'Label for the public Donate control.',
      },
    },
    {
      name: 'facebookUrl',
      type: 'text',
      admin: {
        description: 'Optional Facebook page URL.',
      },
    },
    {
      name: 'contactEmail',
      type: 'email',
      admin: {
        description: 'Optional public contact address shown in the footer.',
      },
    },
    {
      name: 'notificationEmail',
      type: 'email',
      access: {
        read: staffField,
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: {
        description: 'Where contact and grant form notifications are sent. Never shown on the public site.',
      },
    },
    {
      name: 'footerNote',
      type: 'textarea',
      admin: {
        description: 'Optional footer line, such as volunteer-led in Saratoga Springs, New York.',
      },
    },
    {
      type: 'collapsible',
      label: 'Search and social',
      admin: {
        initCollapsed: true,
        description: 'Default listing copy and the image used when a page does not set its own share image.',
      },
      fields: [
        {
          name: 'defaultDescription',
          type: 'textarea',
          maxLength: 320,
          defaultValue: DEFAULT_DESCRIPTION,
          admin: {
            description:
              'Fallback search description for pages that do not set their own. Homepage copy is stored on the Home page.',
          },
        },
        {
          name: 'defaultSocialImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Default Open Graph image for social shares. Use a wide recreation photograph, about 1200×630. Falls back to the logo if empty.',
          },
        },
      ],
    },
  ],
}
