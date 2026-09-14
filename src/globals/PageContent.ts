import type { GlobalConfig } from 'payload'

import { anyone, staffOnly } from '@/access'

export const PageContent: GlobalConfig = {
  slug: 'page-content',
  label: 'Page content',
  admin: {
    description: 'Intro copy and empty states for Board Members, Events, and Projects & Grants.',
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
      type: 'group',
      name: 'board',
      label: 'Board Members page',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Board members',
        },
        {
          name: 'intro',
          type: 'textarea',
          admin: {
            description: 'Optional introduction. Do not invent board biographies here.',
          },
        },
        {
          name: 'emptyMessage',
          type: 'textarea',
          defaultValue: 'Board member listings will appear here once they are confirmed.',
        },
      ],
    },
    {
      type: 'group',
      name: 'events',
      label: 'Events page',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Events',
        },
        {
          name: 'intro',
          type: 'textarea',
        },
        {
          name: 'emptyUpcomingMessage',
          type: 'textarea',
          required: true,
          defaultValue:
            'No upcoming events are listed right now. Check the Friends of Recreation Facebook page for the latest gatherings.',
          admin: {
            description: 'Shown when there are no upcoming published events. May point people to Facebook.',
          },
        },
      ],
    },
    {
      type: 'group',
      name: 'projects',
      label: 'Projects and Grants page',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Projects and grants',
        },
        {
          name: 'intro',
          type: 'textarea',
        },
        {
          name: 'grantHeading',
          type: 'text',
          defaultValue: 'Request grant support',
        },
        {
          name: 'grantIntro',
          type: 'textarea',
          admin: {
            description: 'Explains the grant request form. Do not promise an application portal.',
          },
        },
        {
          name: 'emptyMessage',
          type: 'textarea',
          defaultValue: 'Project stories will appear here as the board publishes confirmed grants and improvements.',
        },
      ],
    },
  ],
}
