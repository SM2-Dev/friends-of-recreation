import type { Block, Field } from 'payload'

import { surfaceField, type Surface } from '@/lib/surfaces'

const photograph: Field[] = [
  {
    name: 'image',
    type: 'upload',
    relationTo: 'media',
    required: true,
  },
  {
    name: 'position',
    type: 'text',
    defaultValue: 'center',
    admin: {
      description: 'CSS object-position, such as center or 30% 40%, so faces stay in crop.',
    },
  },
]

const optionalFormPhoto: Field[] = [
  {
    name: 'photo',
    type: 'upload',
    relationTo: 'media',
    admin: {
      description:
        'Optional photograph under the statement, beside the form. Leave blank to use a recent public photo.',
    },
  },
  {
    name: 'photoPosition',
    type: 'text',
    defaultValue: 'center',
    admin: {
      description: 'CSS object-position, such as center or 30% 40%, so faces stay in crop.',
      condition: (_, siblingData) => Boolean(siblingData?.photo),
    },
  },
]

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Building More Opportunities to Play in Saratoga Springs.',
      admin: {
        description: 'Keep it short enough to stay on the first screen with Donate.',
      },
    },
    {
      name: 'photos',
      type: 'array',
      maxRows: 3,
      labels: { singular: 'Photograph', plural: 'Photographs' },
      admin: {
        description: 'Add 1 photograph, or 3 for an offset cluster. Two also works.',
      },
      fields: photograph,
    },
    {
      name: 'fallbackImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Used only when Photographs is empty.',
      },
    },
    {
      name: 'fallbackImagePosition',
      type: 'text',
      defaultValue: 'center',
    },
    {
      name: 'secondaryLabel',
      type: 'text',
      defaultValue: 'View Our Impact',
      admin: {
        description: 'Optional second button beside Donate. Leave blank to hide it.',
      },
    },
    {
      name: 'secondaryHref',
      type: 'text',
      defaultValue: '/projects-grants',
    },
  ],
}

export const Mission: Block = {
  slug: 'mission',
  labels: { singular: 'Mission', plural: 'Mission sections' },
  interfaceName: 'MissionBlock',
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The large statement on the teal field.',
      },
    },
    {
      name: 'highlight',
      type: 'text',
      admin: {
        description: 'Optional phrase in the heading to underline. It must match the heading exactly.',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'note',
      type: 'textarea',
      admin: {
        description: 'Optional quieter closing line.',
      },
    },
  ],
}

export const Impact: Block = {
  slug: 'impact',
  labels: { singular: 'Community impact', plural: 'Community impact sections' },
  interfaceName: 'ImpactBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'What your support pays for',
    },
    {
      name: 'intro',
      type: 'textarea',
    },
    {
      name: 'stories',
      type: 'array',
      maxRows: 3,
      admin: {
        description:
          'Up to three impact stories. Leave empty rather than inventing results.',
      },
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
        {
          name: 'proofLabel',
          type: 'text',
          admin: {
            description: 'Optional inscribed proof, such as a year, amount, or recipient.',
          },
        },
      ],
    },
  ],
}

export const OrganizationsBlock: Block = {
  slug: 'organizations',
  labels: { singular: 'Supported programs', plural: 'Supported programs sections' },
  interfaceName: 'OrganizationsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Supported programs and facilities',
    },
    {
      name: 'organizations',
      type: 'relationship',
      relationTo: 'organizations',
      hasMany: true,
      admin: {
        description: 'Programs and facilities to show in this section.',
      },
    },
  ],
}

export const FeaturedProjects: Block = {
  slug: 'featuredProjects',
  labels: { singular: 'Featured projects', plural: 'Featured project sections' },
  interfaceName: 'FeaturedProjectsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Featured projects and grants',
    },
    {
      name: 'intro',
      type: 'textarea',
    },
    {
      name: 'emptyMessage',
      type: 'textarea',
      defaultValue:
        'Project stories will appear here as the board publishes confirmed grants and improvements.',
    },
    {
      name: 'allLabel',
      type: 'text',
      defaultValue: 'All projects and grants',
    },
    {
      name: 'allHref',
      type: 'text',
      defaultValue: '/projects-grants',
    },
  ],
}

export const PhotoRailBlock: Block = {
  slug: 'photoRail',
  labels: { singular: 'Photo rail', plural: 'Photo rails' },
  interfaceName: 'PhotoRailBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Recreation around town',
      admin: {
        description: 'Screen-reader heading for the photograph slider.',
      },
    },
    {
      name: 'slides',
      type: 'array',
      labels: { singular: 'Slide', plural: 'Slides' },
      admin: {
        description: 'Recreation photographs only. Organization logos belong on Organization records.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}

export const UpcomingEvents: Block = {
  slug: 'upcomingEvents',
  labels: { singular: 'Upcoming events', plural: 'Upcoming event sections' },
  interfaceName: 'UpcomingEventsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Upcoming events',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 8,
      admin: {
        description: 'How many upcoming events to show. The first is featured.',
      },
    },
    {
      name: 'emptyHeading',
      type: 'text',
      defaultValue: 'Nothing on the calendar right now',
    },
    {
      name: 'emptyMessage',
      type: 'textarea',
      defaultValue:
        'No upcoming events are listed right now. Check the Friends of Recreation Facebook page for the latest gatherings.',
    },
    {
      name: 'allLabel',
      type: 'text',
      defaultValue: 'All events',
    },
    {
      name: 'allHref',
      type: 'text',
      defaultValue: '/events',
    },
  ],
}

export const DonateCta: Block = {
  slug: 'donateCta',
  labels: { singular: 'Donate call to action', plural: 'Donate calls to action' },
  interfaceName: 'DonateCtaBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Help more kids play here',
    },
    {
      name: 'body',
      type: 'textarea',
    },
    {
      name: 'secondaryLabel',
      type: 'text',
      admin: {
        description: 'Optional second button beside Donate.',
      },
    },
    {
      name: 'secondaryHref',
      type: 'text',
    },
  ],
}

export const Contact: Block = {
  slug: 'contact',
  labels: { singular: 'Contact form', plural: 'Contact forms' },
  interfaceName: 'ContactBlock',
  fields: [
    {
      name: 'statement',
      type: 'textarea',
      defaultValue: 'Questions, ideas, and offers to help all reach the same volunteers.',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Ask a question',
    },
    {
      name: 'intro',
      type: 'textarea',
    },
    ...optionalFormPhoto,
  ],
}

export const Masthead: Block = {
  slug: 'masthead',
  labels: { singular: 'Page masthead', plural: 'Page mastheads' },
  interfaceName: 'MastheadBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'lede',
      type: 'textarea',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional supporting photograph. Leave blank to use a recent public photo.',
      },
    },
    {
      name: 'photoFallbackIndex',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 8,
      admin: {
        description: 'Which recent public photograph to use when no photo is chosen. 0 is the newest.',
      },
    },
  ],
}

export const BoardList: Block = {
  slug: 'boardList',
  labels: { singular: 'Board members', plural: 'Board member sections' },
  interfaceName: 'BoardListBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Your neighbours on the board',
    },
    {
      name: 'emptyHeading',
      type: 'text',
      defaultValue: 'The board is confirming its roster',
    },
    {
      name: 'emptyMessage',
      type: 'textarea',
      defaultValue: 'Board member listings will appear here once they are confirmed.',
    },
    {
      name: 'emptyNote',
      type: 'textarea',
      defaultValue:
        'Names, roles, and photographs are published only after the volunteers themselves approve them, so nothing is guessed at here.',
    },
  ],
}

export const EventList: Block = {
  slug: 'eventList',
  labels: { singular: 'Event listings', plural: 'Event listing sections' },
  interfaceName: 'EventListBlock',
  fields: [
    {
      name: 'upcomingHeading',
      type: 'text',
      defaultValue: 'Upcoming events',
    },
    {
      name: 'pastHeading',
      type: 'text',
      defaultValue: 'Past events',
    },
    {
      name: 'emptyHeading',
      type: 'text',
      defaultValue: 'Nothing on the calendar right now',
    },
    {
      name: 'emptyMessage',
      type: 'textarea',
      required: true,
      defaultValue:
        'No upcoming events are listed right now. Check the Friends of Recreation Facebook page for the latest gatherings.',
    },
  ],
}

export const ProjectLedger: Block = {
  slug: 'projectLedger',
  labels: { singular: 'Projects ledger', plural: 'Project ledgers' },
  interfaceName: 'ProjectLedgerBlock',
  fields: [
    {
      name: 'categoryHeading',
      type: 'text',
      defaultValue: 'What we fund',
      admin: {
        description: 'Heading above the five project categories.',
      },
    },
    {
      name: 'categoryIntro',
      type: 'textarea',
      admin: {
        description: 'Optional sentence under the category heading. Leave blank to let the five names speak.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Leave blank to use the funded-year range from published projects.',
      },
    },
    {
      name: 'confirmationNote',
      type: 'textarea',
      admin: {
        description:
          'Shown beside the ledger heading. Use this to say the history is pending board confirmation.',
      },
    },
    {
      name: 'emptyHeading',
      type: 'text',
      defaultValue: 'The published record is being confirmed',
    },
    {
      name: 'emptyMessage',
      type: 'textarea',
      defaultValue:
        'Project stories will appear here as the board publishes confirmed grants and improvements.',
    },
  ],
}

export const GrantRequest: Block = {
  slug: 'grantRequest',
  labels: { singular: 'Grant request form', plural: 'Grant request forms' },
  interfaceName: 'GrantRequestBlock',
  fields: [
    {
      name: 'statement',
      type: 'textarea',
      defaultValue:
        'If a Saratoga Springs project needs a push, we would rather hear about it than miss it.',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Have a Recreation Project We Should Know About?',
    },
    {
      name: 'intro',
      type: 'textarea',
    },
    ...optionalFormPhoto,
  ],
}

function withBackground(block: Block, fallback: Surface): Block {
  return {
    ...block,
    fields: [...block.fields, surfaceField(fallback)],
  }
}

export const pageLayoutBlocks: Block[] = [
  withBackground(Hero, 'paper'),
  withBackground(Mission, 'teal'),
  withBackground(Impact, 'tint'),
  withBackground(OrganizationsBlock, 'paper'),
  withBackground(FeaturedProjects, 'paper'),
  withBackground(PhotoRailBlock, 'paper'),
  withBackground(UpcomingEvents, 'tint'),
  withBackground(DonateCta, 'flare'),
  withBackground(Contact, 'paper'),
  withBackground(Masthead, 'paper'),
  withBackground(BoardList, 'paper'),
  withBackground(EventList, 'paper'),
  withBackground(ProjectLedger, 'field'),
  withBackground(GrantRequest, 'paper'),
]
