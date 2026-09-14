import type { Payload } from 'payload'

const DEVELOPMENT_NOTICE =
  '[DEV PLACEHOLDER] Temporary development copy. Not confirmed Friends of Recreation language.'

export async function seedDevelopmentContent(payload: Payload): Promise<void> {
  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    data: {
      siteName: 'Friends of Recreation',
      tagline: 'Saratoga Springs, New York',
      donationLabel: 'Donate',
      footerNote: `${DEVELOPMENT_NOTICE} Volunteer-led support for recreation programs, facilities, equipment, camps, and scholarships in Saratoga Springs.`,
    },
  })

  await payload.updateGlobal({
    slug: 'home-page',
    overrideAccess: true,
    draft: false,
    data: {
      missionHeading: 'Building More Opportunities to Play in Saratoga Springs.',
      missionBody: `${DEVELOPMENT_NOTICE} Friends of Recreation raises funds for local recreation programs, playgrounds, facilities, equipment, camps, and scholarships. This sentence is starter copy until the board approves final language.`,
      impactHeading: 'What the funds make possible',
      impactIntro: `${DEVELOPMENT_NOTICE} These lines describe the kinds of support Friends of Recreation exists to provide. They are not published results.`,
      impactStories: [
        {
          heading: 'Programs that stay in motion',
          body: `${DEVELOPMENT_NOTICE} Rec leagues, camps, and everyday programs need equipment and operating help so more kids can show up and play.`,
        },
        {
          heading: 'Places to gather',
          body: `${DEVELOPMENT_NOTICE} Playgrounds, fields, and indoor facilities wear out. Funding keeps the physical places usable.`,
        },
        {
          heading: 'Room for every family',
          body: `${DEVELOPMENT_NOTICE} Scholarships and community projects help participation stay open when cost would otherwise close the gate.`,
        },
      ],
      organizationsHeading: 'Supported programs and facilities',
      featuredOrganizations: [],
      projectsHeading: 'Featured projects and grants',
      featuredProjects: [],
      donationHeading: 'Help more kids play here',
      donationBody: `${DEVELOPMENT_NOTICE} Donations are processed on an external page once the board confirms the URL. The site will not invent a payment link.`,
      contactHeading: 'Ask a question',
      contactIntro: `${DEVELOPMENT_NOTICE} Send a question to the board. Messages are stored for staff. Email delivery and spam protection are not connected until those credentials exist.`,
    },
  })

  await payload.updateGlobal({
    slug: 'page-content',
    overrideAccess: true,
    draft: false,
    data: {
      board: {
        heading: 'Board members',
        intro: `${DEVELOPMENT_NOTICE} Confirmed volunteer board listings will appear here. Names are not invented for development.`,
        emptyMessage: 'Board member listings will appear here once they are confirmed.',
      },
      events: {
        heading: 'Upcoming events',
        intro: `${DEVELOPMENT_NOTICE} Upcoming and past events will be listed from Payload once dates are published.`,
        emptyUpcomingMessage:
          'No upcoming events are listed right now. Check the Friends of Recreation Facebook page for the latest gatherings.',
      },
      projects: {
        heading: 'Projects and grants',
        intro: `${DEVELOPMENT_NOTICE} Confirmed projects, amounts, recipients, and beneficiaries will be published here. Sample funding figures are not shown.`,
        grantHeading: 'Request grant support',
        grantIntro: `${DEVELOPMENT_NOTICE} Organizations can request grant support. The public form will be completed in a later pass.`,
        emptyMessage:
          'Project stories will appear here as the board publishes confirmed grants and improvements.',
      },
    },
  })
}
