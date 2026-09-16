import type { Payload } from 'payload'

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
    category: 'equipment',
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

export async function seedDevelopmentContent(payload: Payload): Promise<void> {
  const projectIds = await upsertProjects(payload)
  const organizationIds = await upsertOrganizations(payload)
  const heroImage = await findMediaByFilename(payload, HERO_PHOTO)

  const featured = [
    'Floor Hockey Goals',
    'Vernon Ice Rink Scoreboard',
    'Veterans Memorial Park Accessible Playground Improvements',
    'Youth Basketball & Soccer Equipment',
  ]
    .map((title) => projectIds[title])
    .filter((id): id is number => typeof id === 'number')

  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    data: {
      siteName: 'Friends of Recreation',
      tagline: 'Saratoga Springs, NY',
      donationLabel: 'Support Friends of Recreation',
      footerNote:
        'A volunteer-led organization raising funds for playgrounds, athletic facilities, youth equipment, camps, and community recreation projects in Saratoga Springs, New York.',
    },
  })

  await payload.updateGlobal({
    slug: 'home-page',
    overrideAccess: true,
    draft: false,
    data: {
      missionHeading: 'Building More Opportunities to Play in Saratoga Springs.',
      missionBody:
        'Saratoga Springs Friends of Recreation brings our community together to support the programs, facilities and opportunities that keep Saratoga active.',
      ...(heroImage
        ? {
            heroImage,
            heroPhotos: [{ image: heroImage, position: 'center' }],
          }
        : {}),
      heroImagePosition: 'center',
      photoSlider: [],
      impactHeading: 'What your support pays for',
      impactIntro:
        'Three things we fund again and again, because together they are what keeps a town playing.',
      impactStories: [
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
      organizationsHeading: 'Supported programs and facilities',
      featuredOrganizations: organizationIds,
      projectsHeading: 'Featured projects and grants',
      featuredProjects: featured,
      donationHeading: 'Help more kids play here',
      donationBody:
        'Every gift buys something specific: equipment for a youth program, a seat on a playground, a scoreboard at the rink, a week of camp for a family that needs it.',
      contactHeading: 'Ask a question',
      contactIntro:
        'Questions about a project, an event, or how to help out? Send a note and a volunteer will get back to you.',
    },
  })

  await payload.updateGlobal({
    slug: 'page-content',
    overrideAccess: true,
    draft: false,
    data: {
      board: {
        heading: 'Meet the Friends Behind the Mission',
        intro:
          'Friends of Recreation is led by community volunteers who believe recreation plays an important role in making Saratoga Springs a stronger, healthier, and more connected community.',
        emptyMessage: 'Board member listings will appear here once they are confirmed.',
      },
      events: {
        heading: 'Get out and play with us',
        intro:
          'Friends of Recreation events bring neighbours together to raise money for local recreation. Where there is more to read, the event links out to Facebook or a partner site.',
        emptyUpcomingMessage:
          'No upcoming events are listed right now. Check the Friends of Recreation Facebook page for the latest gatherings.',
      },
      projects: {
        heading: 'See Your Support in Action',
        intro:
          'From playground improvements and sports equipment to camps and community recreation projects, Friends of Recreation helps turn community support into real opportunities for Saratoga Springs residents.',
        grantHeading: 'Have a Recreation Project We Should Know About?',
        grantIntro:
          'Tell us what you are trying to build, fix, or fund. Requests go straight to the volunteer board.',
        emptyMessage:
          'Project stories will appear here as the board publishes confirmed grants and improvements.',
      },
    },
  })
}
