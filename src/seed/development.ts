import type { Payload } from 'payload'

import type { Page } from '@/payload-types'

/**
 * Starter content for Friends of Recreation.
 *
 * Everything here is taken from the client's own implementation brief
 * (Friends_of_Recreation_Website_Implementation_Brief.docx, revision
 * September 11, 2026): the suggested mission wording, the three impact pillars,
 * the "Starter public project history" table, and the facilities and partners
 * that table names.
 *
 * It is brief-supplied starter content pending board confirmation, not
 * independently verified fact. Nothing is invented here: no board members, no
 * events, no donation URL, no aggregate totals, and no photograph is claimed to
 * depict a specific funded project.
 */

const HERO_PHOTO = '67870683_1689183097881060_4327719617087668224_n.jpg'

type SeedProject = {
  title: string
  year: number
  category: 'playground' | 'facility' | 'equipment' | 'camp' | 'scholarship' | 'other'
  amountLabel?: string
  summary: string
  featured?: boolean
}

/** The brief's starter public project history, newest first. */
const PROJECTS: SeedProject[] = [
  {
    title: 'Floor Hockey Goals',
    year: 2026,
    category: 'equipment',
    amountLabel: '$500',
    summary: 'Floor hockey goals funded for Saratoga Springs recreation programs.',
    featured: true,
  },
  {
    title: 'Waterfront Playground Bucket Seat',
    year: 2025,
    category: 'playground',
    amountLabel: '$515',
    summary: 'A bucket seat for the Waterfront Playground, so the swings work for the smallest kids.',
  },
  {
    title: 'Youth Basketball & Soccer Equipment',
    year: 2024,
    category: 'equipment',
    amountLabel: '$5,269.44',
    summary: 'Equipment for youth basketball and soccer programs in Saratoga Springs.',
    featured: true,
  },
  {
    title: 'Veterans Memorial Park Accessible Playground Improvements',
    year: 2023,
    category: 'playground',
    amountLabel: '$4,535',
    summary:
      'Accessible playground improvements at Veterans Memorial Park, so more children can use the same equipment.',
    featured: true,
  },
  {
    title: 'Soccer Goals & Equipment',
    year: 2023,
    category: 'equipment',
    amountLabel: '$4,448',
    summary: 'Soccer goals and equipment for local youth soccer.',
  },
  {
    title: 'Vernon Ice Rink Scoreboard',
    year: 2023,
    category: 'facility',
    amountLabel: '$14,643 through Friends of Recreation / Adirondack Trust support',
    summary: 'A scoreboard for the Vernon Ice Rink, funded with Adirondack Trust support.',
    featured: true,
  },
  {
    title: 'Camp Saradac',
    year: 2021,
    category: 'camp',
    amountLabel: '$1,000',
    summary: 'Support for Camp Saradac, the city summer day camp.',
  },
  {
    title: 'Camp Saradac Scholarships & Field Trips',
    year: 2019,
    category: 'scholarship',
    amountLabel: '$5,275',
    summary: 'Camp scholarships and field trips for Camp Saradac campers.',
  },
  {
    title: 'Jonathan Noonan Dugouts',
    year: 2019,
    category: 'facility',
    amountLabel: '$15,430',
    summary: 'Dugouts built at Jonathan Noonan, the largest single project on this list.',
  },
  {
    title: 'Youth Recreation Equipment & Facility Improvements',
    year: 2017,
    category: 'other',
    amountLabel: 'Nearly $3,400',
    summary:
      'Basketballs, soccer balls, ice-rink clocks, and drinking fountains for youth recreation and city facilities.',
  },
]

/** Only places and partners the brief itself names. */
const ORGANIZATIONS: Array<{ name: string; summary: string; website?: string }> = [
  {
    name: 'Saratoga Springs Recreation Department',
    summary: 'The city department Friends of Recreation works alongside on projects and programs.',
    website: 'https://www.saratogaspringsny.gov/',
  },
  {
    name: 'Community Foundation for the Greater Capital Region',
    summary: 'Charitable partner for gifts that support Friends of Recreation.',
  },
  {
    name: 'Camp Saradac',
    summary: 'The city summer day camp, supported with scholarships, field trips, and equipment.',
  },
  {
    name: 'Vernon Ice Rink',
    summary: 'Outdoor rink where Friends of Recreation funded the scoreboard.',
  },
  {
    name: 'Veterans Memorial Park',
    summary: 'Site of accessible playground improvements funded in 2023.',
  },
  {
    name: 'Waterfront Playground',
    summary: 'Playground where a new bucket seat was funded in 2025.',
  },
  {
    name: 'Youth Basketball and Soccer Programs',
    summary: 'Local youth leagues supplied with goals, balls, and program equipment.',
  },
]

async function findMediaByFilename(payload: Payload, filename: string): Promise<number | null> {
  try {
    const result = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      overrideAccess: true,
      depth: 0,
    })
    return result.docs[0]?.id ?? null
  } catch {
    return null
  }
}

async function upsertProjects(payload: Payload): Promise<Record<string, number>> {
  const ids: Record<string, number> = {}

  for (const project of PROJECTS) {
    const existing = await payload.find({
      collection: 'projects',
      where: { and: [{ title: { equals: project.title } }, { year: { equals: project.year } }] },
      limit: 1,
      overrideAccess: true,
      depth: 0,
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'projects',
        id: existing.docs[0].id,
        overrideAccess: true,
        draft: false,
        data: {
          title: project.title,
          year: project.year,
          category: project.category,
          amountLabel: project.amountLabel ?? null,
          summary: project.summary,
          featured: Boolean(project.featured),
          _status: 'published',
        },
      })
      ids[project.title] = existing.docs[0].id
      continue
    }

    const created = await payload.create({
      collection: 'projects',
      overrideAccess: true,
      data: {
        title: project.title,
        year: project.year,
        category: project.category,
        amountLabel: project.amountLabel ?? null,
        summary: project.summary,
        featured: Boolean(project.featured),
        _status: 'published',
      },
    })

    ids[project.title] = created.id
  }

  return ids
}

async function upsertOrganizations(payload: Payload): Promise<number[]> {
  const ids: number[] = []

  for (const organization of ORGANIZATIONS) {
    const existing = await payload.find({
      collection: 'organizations',
      where: { name: { equals: organization.name } },
      limit: 1,
      overrideAccess: true,
      depth: 0,
    })

    if (existing.docs[0]) {
      ids.push(existing.docs[0].id)
      continue
    }

    const created = await payload.create({
      collection: 'organizations',
      overrideAccess: true,
      data: {
        name: organization.name,
        summary: organization.summary,
        website: organization.website ?? null,
        _status: 'published',
      },
    })

    ids.push(created.id)
  }

  return ids
}

async function upsertPage(
  payload: Payload,
  data: Pick<
    Page,
    | 'title'
    | 'slug'
    | 'showInNav'
    | 'navLabel'
    | 'navOrder'
    | 'metaTitle'
    | 'metaDescription'
    | 'layout'
    | '_status'
  >,
): Promise<void> {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: data.slug } },
    limit: 1,
    overrideAccess: true,
    depth: 0,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      overrideAccess: true,
      draft: false,
      data,
    })
    return
  }

  await payload.create({
    collection: 'pages',
    overrideAccess: true,
    draft: false,
    data,
  })
}

export async function seedDevelopmentContent(payload: Payload): Promise<void> {
  await upsertProjects(payload)
  const organizationIds = await upsertOrganizations(payload)
  const heroImage = await findMediaByFilename(payload, HERO_PHOTO)

  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    data: {
      siteName: 'Friends of Recreation',
      tagline: 'Saratoga Springs, NY',
      donationLabel: 'Support Friends of Recreation',
      defaultDescription:
        'Saratoga Springs Friends of Recreation supports local youth programs, playgrounds, recreational facilities, equipment, camps, and community recreation projects.',
      footerNote:
        'A volunteer-led organization raising funds for playgrounds, athletic facilities, youth equipment, camps, and community recreation projects in Saratoga Springs, New York.',
    },
  })

  const heroPhotos = heroImage ? [{ image: heroImage, position: 'center' }] : []
  const donationBody =
    'Every gift buys something specific: equipment for a youth program, a seat on a playground, a scoreboard at the rink, a week of camp for a family that needs it.'

  await upsertPage(payload, {
    title: 'Home',
    slug: 'home',
    showInNav: true,
    navLabel: 'Home',
    navOrder: 0,
    metaTitle: 'Friends of Recreation | Saratoga Springs, NY',
    metaDescription:
      'Saratoga Springs Friends of Recreation supports local youth programs, playgrounds, recreational facilities, equipment, camps, and community recreation projects.',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        heading: 'Building More Opportunities to Play in Saratoga Springs.',
        photos: heroPhotos,
        fallbackImage: heroImage,
        fallbackImagePosition: 'center',
        secondaryLabel: 'View Our Impact',
        secondaryHref: '/projects-grants',
      },
      {
        blockType: 'mission',
        heading:
          'Saratoga Springs Friends of Recreation is a volunteer-led organization dedicated to supporting recreation throughout our community.',
        highlight: 'recreation throughout our community',
        body:
          'Working alongside the Saratoga Springs Recreation Department and community partners, Friends of Recreation raises funds for improvements to playgrounds and athletic facilities, equipment for youth programs, camp opportunities, and projects that make recreation more accessible to Saratoga Springs families.',
        note:
          'We are neighbours, parents, coaches, and volunteers. Every grant on this site was paid for by people who live here.',
      },
      {
        blockType: 'impact',
        heading: 'What your support pays for',
        intro: 'Three things we fund again and again, because together they are what keeps a town playing.',
        stories: [
          {
            heading: 'Better Places to Play',
            body: 'Support improvements to playgrounds, athletic fields, ice rinks, and other community recreation facilities.',
            proofLabel: 'Veterans Memorial Park · Vernon Ice Rink · Waterfront Playground',
          },
          {
            heading: 'More Opportunities for Kids',
            body: 'Help provide equipment, programs, and experiences that make recreation accessible to more children.',
            proofLabel: 'Camp Saradac scholarships · youth basketball and soccer equipment',
          },
          {
            heading: 'A Stronger Community',
            body: 'Bring residents, businesses, and community organizations together around projects that improve recreation in Saratoga Springs.',
            proofLabel: 'Saratoga Springs Recreation Department · Adirondack Trust',
          },
        ],
      },
      {
        blockType: 'organizations',
        heading: 'Supported programs and facilities',
        organizations: organizationIds,
      },
      {
        blockType: 'featuredProjects',
        heading: 'Featured projects and grants',
        intro:
          'Every line is a real thing somebody in Saratoga Springs can use: goals, seats, scoreboards, equipment, camp weeks.',
        emptyMessage:
          'Project stories will appear here as the board publishes confirmed grants and improvements.',
        allLabel: 'All projects and grants',
        allHref: '/projects-grants',
      },
      {
        blockType: 'photoRail',
        heading: 'Recreation around town',
        slides: [],
      },
      {
        blockType: 'upcomingEvents',
        heading: 'Upcoming events',
        limit: 3,
        emptyHeading: 'Nothing on the calendar right now',
        emptyMessage:
          'No upcoming events are listed right now. Check the Friends of Recreation Facebook page for the latest gatherings.',
        allLabel: 'All events',
        allHref: '/events',
      },
      {
        blockType: 'donateCta',
        heading: 'Help more kids play here',
        body: donationBody,
        secondaryLabel: 'Request grant support',
        secondaryHref: '/projects-grants#grant-request',
      },
      {
        blockType: 'contact',
        statement: 'Questions, ideas, and offers to help all reach the same volunteers.',
        heading: 'Ask a question',
        intro:
          'Questions about a project, an event, or how to help out? Send a note and a volunteer will get back to you.',
        photo: heroImage,
        photoPosition: 'center',
      },
    ],
  })

  await upsertPage(payload, {
    title: 'Board Members',
    slug: 'board-members',
    showInNav: true,
    navLabel: 'Board Members',
    navOrder: 1,
    metaTitle: 'Board members',
    metaDescription:
      'The volunteer board behind Saratoga Springs Friends of Recreation, the community members who raise funds for local recreation.',
    _status: 'published',
    layout: [
      {
        blockType: 'masthead',
        heading: 'Meet the Friends Behind the Mission',
        lede:
          'Friends of Recreation is led by community volunteers who believe recreation plays an important role in making Saratoga Springs a stronger, healthier, and more connected community.',
        photoFallbackIndex: 1,
      },
      {
        blockType: 'boardList',
        heading: 'Your neighbours on the board',
        emptyHeading: 'The board is confirming its roster',
        emptyMessage: 'Board member listings will appear here once they are confirmed.',
        emptyNote:
          'Names, roles, and photographs are published only after the volunteers themselves approve them, so nothing is guessed at here.',
      },
      {
        blockType: 'donateCta',
        heading: 'Help more kids play here',
        body: donationBody,
        secondaryLabel: 'Ask a question',
        secondaryHref: '/#ask',
      },
    ],
  })

  await upsertPage(payload, {
    title: 'Events',
    slug: 'events',
    showInNav: true,
    navLabel: 'Events',
    navOrder: 2,
    metaTitle: 'Events',
    metaDescription:
      'Upcoming and past Friends of Recreation events in Saratoga Springs, including community gatherings and fundraisers.',
    _status: 'published',
    layout: [
      {
        blockType: 'masthead',
        heading: 'Get out and play with us',
        lede:
          'Friends of Recreation events bring neighbours together to raise money for local recreation. Where there is more to read, the event links out to Facebook or a partner site.',
        photoFallbackIndex: 5,
      },
      {
        blockType: 'eventList',
        upcomingHeading: 'Upcoming events',
        pastHeading: 'Past events',
        emptyHeading: 'Nothing on the calendar right now',
        emptyMessage:
          'No upcoming events are listed right now. Check the Friends of Recreation Facebook page for the latest gatherings.',
      },
      {
        blockType: 'donateCta',
        heading: 'Help more kids play here',
        body: donationBody,
        secondaryLabel: 'Ask a question',
        secondaryHref: '/#ask',
      },
    ],
  })

  await upsertPage(payload, {
    title: 'Projects & Grants',
    slug: 'projects-grants',
    showInNav: true,
    navLabel: 'Projects & Grants',
    navOrder: 3,
    metaTitle: 'Projects and grants',
    metaDescription:
      'What Friends of Recreation has funded in Saratoga Springs: playgrounds, athletic facilities, youth equipment, camps, and community recreation projects.',
    _status: 'published',
    layout: [
      {
        blockType: 'masthead',
        heading: 'See Your Support in Action',
        lede:
          'From playground improvements and sports equipment to camps and community recreation projects, Friends of Recreation helps turn community support into real opportunities for Saratoga Springs residents.',
        photoFallbackIndex: 3,
      },
      {
        blockType: 'projectLedger',
        categoryHeading: 'What we fund',
        confirmationNote:
          'This starter history comes from the implementation brief. Years, amounts, photography, and whether each item stays public still need board confirmation.',
        emptyHeading: 'The published record is being confirmed',
        emptyMessage:
          'Project stories will appear here as the board publishes confirmed grants and improvements.',
        background: 'field',
      },
      {
        blockType: 'grantRequest',
        statement:
          'If a Saratoga Springs project needs a push, we would rather hear about it than miss it.',
        heading: 'Have a Recreation Project We Should Know About?',
        intro: 'Tell us what you are trying to build, fix, or fund. Requests go straight to the volunteer board.',
        photo: heroImage,
        photoPosition: 'center',
        background: 'paper',
      },
      {
        blockType: 'donateCta',
        heading: 'Help more kids play here',
        body: donationBody,
        secondaryLabel: 'See upcoming events',
        secondaryHref: '/events',
      },
    ],
  })
}
