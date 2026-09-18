import Link from 'next/link'
import type { ReactNode } from 'react'

import { ContactForm } from '@/components/ContactForm'
import { DonateBand } from '@/components/DonateBand'
import { DonateControl } from '@/components/DonateControl'
import { EventRow } from '@/components/EventRow'
import { FeaturedGrants } from '@/components/FeaturedGrants'
import { GrantRequestForm } from '@/components/GrantRequestForm'
import { NextEventCard } from '@/components/NextEventCard'
import { OrgMarks } from '@/components/OrgMarks'
import { PageMasthead } from '@/components/PageMasthead'
import { PhotoRail } from '@/components/PhotoRail'
import { ProjectLedger } from '@/components/ProjectLedger'
import { SiteImage } from '@/components/SiteImage'
import {
  getAllEvents,
  getBoardMembers,
  getFeaturedProjects,
  getGalleryPhotos,
  getSiteSettings,
  getUpcomingEvents,
} from '@/lib/cms'
import { heroPhotosFrom, proofItems, sliderPhotosFrom, type HomePhoto } from '@/lib/display'
import { stagger } from '@/lib/motion'
import { isOrganization, relatedDocs } from '@/lib/relations'
import { surfaceClass } from '@/lib/surfaces'
import { cn, isMedia } from '@/lib/utils'
import type {
  BoardListBlock,
  BoardMember,
  ContactBlock,
  DonateCtaBlock,
  EventListBlock,
  FeaturedProjectsBlock,
  GrantRequestBlock,
  HeroBlock,
  ImpactBlock,
  MastheadBlock,
  MissionBlock,
  OrganizationsBlock,
  Page,
  PhotoRailBlock,
  UpcomingEventsBlock,
} from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]

function formPhoto(photo: unknown) {
  return isMedia(photo) && photo.url ? photo : null
}

async function resolveFormPhoto(chosen: unknown, fallback: HomePhoto['media'] | null) {
  const selected = formPhoto(chosen) ?? formPhoto(fallback)
  if (selected) return selected

  const settings = await getSiteSettings()
  const logoId = isMedia(settings.logo) ? settings.logo.id : undefined
  const gallery = await getGalleryPhotos(1, logoId)
  return gallery[0] ?? null
}

export async function PageLayout({ page }: { page: Page }) {
  const layout = page.layout ?? []
  const nodes: ReactNode[] = []

  const keyFor = (block: LayoutBlock, i: number) => block.id || `${block.blockType}-${i}`

  for (let index = 0; index < layout.length; index += 1) {
    const block = layout[index]
    const next = layout[index + 1]

    if (block.blockType === 'hero' && next?.blockType === 'mission') {
      const photos = heroPhotosFrom(block)
      nodes.push(
        <div className={photos.length > 0 ? 'opening opening-has-plates' : 'opening'} key={keyFor(block, index)}>
          <HeroSection block={block} />
          <MissionSection block={next} />
        </div>,
      )
      index += 1
      continue
    }

    if (block.blockType === 'donateCta' && next?.blockType === 'contact') {
      nodes.push(
        <div className="cta-consume" key={keyFor(block, index)}>
          <DonateCtaSection block={block} />
          <ContactSection block={next} fallbackPhoto={fallbackPhotoFrom(layout)} />
        </div>,
      )
      index += 1
      continue
    }

    nodes.push(
      <LayoutSection
        block={block}
        fallbackPhoto={fallbackPhotoFrom(layout)}
        key={keyFor(block, index)}
      />,
    )
  }

  return <>{nodes}</>
}

function fallbackPhotoFrom(layout: LayoutBlock[]): HomePhoto['media'] | null {
  for (const block of layout) {
    if (block.blockType === 'photoRail') {
      const photos = sliderPhotosFrom(block)
      if (photos[0]) return photos[0]
    }
    if (block.blockType === 'hero') {
      const photos = heroPhotosFrom(block)
      if (photos[0]) return photos[0].media
    }
  }
  return null
}

function LayoutSection({
  block,
  fallbackPhoto,
}: {
  block: LayoutBlock
  fallbackPhoto: HomePhoto['media'] | null
}) {
  switch (block.blockType) {
    case 'hero':
      return <HeroSection block={block} />
    case 'mission':
      return <MissionSection block={block} />
    case 'impact':
      return <ImpactSection block={block} />
    case 'organizations':
      return <OrganizationsSection block={block} />
    case 'featuredProjects':
      return <FeaturedProjectsSection block={block} />
    case 'photoRail':
      return <PhotoRailSection block={block} />
    case 'upcomingEvents':
      return <UpcomingEventsSection block={block} fallbackPhoto={fallbackPhoto} />
    case 'donateCta':
      return <DonateCtaSection block={block} />
    case 'contact':
      return <ContactSection block={block} fallbackPhoto={fallbackPhoto} />
    case 'masthead':
      return <MastheadSection block={block} />
    case 'boardList':
      return <BoardListSection block={block} />
    case 'eventList':
      return <EventListSection block={block} />
    case 'projectLedger':
      return <ProjectLedger block={block} />
    case 'grantRequest':
      return <GrantRequestSection block={block} fallbackPhoto={fallbackPhoto} />
    default:
      return null
  }
}

async function HeroSection({ block }: { block: HeroBlock }) {
  const settings = await getSiteSettings()
  const donateUrl = 'donationUrl' in settings ? settings.donationUrl : null
  const donateLabel = settings.donationLabel || 'Support Friends of Recreation'
  const photos = heroPhotosFrom(block)
  const secondaryHref = block.secondaryHref?.trim()
  const secondaryLabel = block.secondaryLabel?.trim()

  return (
    <section className={cn('hero', surfaceClass(block.background, 'paper'))}>
      <div className="hero-inner" data-count={String(photos.length)}>
        <div className="hero-copy">
          <h1 className="hero-title">{block.heading}</h1>
          <div className="hero-actions">
            <DonateControl
              describedById={`donate-pending-hero-${block.id}`}
              label={donateLabel}
              pendingLabel={donateLabel}
              pendingVisible
              url={donateUrl}
            />
            {secondaryHref && secondaryLabel ? (
              <Link className="button button-secondary" href={secondaryHref}>
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
        <HeroPlates photos={photos} />
      </div>
    </section>
  )
}

function HeroPlates({ photos }: { photos: HomePhoto[] }) {
  if (photos.length === 0) return null

  return (
    <div className="hero-plate" data-count={String(photos.length)}>
      {photos.map((photo, index) => (
        <SiteImage
          className={`hero-plate-img hero-plate-img-${index + 1}`}
          hideWhenEmpty
          key={`${photo.media.id}-${index}`}
          media={photo.media}
          objectPosition={photo.position}
          priority={index === 0}
          sizes={
            photos.length === 1
              ? '(min-width: 52rem) 28vw, 92vw'
              : index === 0
                ? '(min-width: 52rem) 40vw, 70vw'
                : '(min-width: 52rem) 22vw, 42vw'
          }
        />
      ))}
    </div>
  )
}

function markedHeading(heading: string, highlight?: string | null) {
  const mark = highlight?.trim()
  if (!mark) return heading

  const index = heading.indexOf(mark)
  if (index === -1) return heading

  return (
    <>
      {heading.slice(0, index)}
      <span className="mark">{mark}</span>
      {heading.slice(index + mark.length)}
    </>
  )
}

function MissionSection({ block }: { block: MissionBlock }) {
  return (
    <section aria-labelledby={`mission-${block.id}`} className={cn('opening-mission', surfaceClass(block.background, 'teal'))}>
      <div className="band-inner mission-inner">
        <div data-reveal="idle">
          <h2 className="mission-statement" id={`mission-${block.id}`}>
            {markedHeading(block.heading, block.highlight)}
          </h2>
        </div>
        <div className="mission-body" data-reveal="idle" style={stagger(120)}>
          {block.body.split(/\n\n+/).map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          {block.note ? <p className="body-note">{block.note}</p> : null}
        </div>
      </div>
    </section>
  )
}

function ImpactSection({ block }: { block: ImpactBlock }) {
  const stories = block.stories || []
  if (stories.length === 0) return null

  const headingId = `impact-${block.id}`

  return (
    <section aria-labelledby={headingId} className={cn('band plane-over', surfaceClass(block.background, 'tint'))}>
      <div className="band-inner">
        <div className="band-head">
          <div data-reveal="idle">
            <h2 id={headingId}>{block.heading || 'What your support pays for'}</h2>
            {block.intro ? <p className="pillar-lede">{block.intro}</p> : null}
          </div>
        </div>
        <ol className="pillars">
          {stories.map((story, index) => {
            const proof = proofItems(story.proofLabel)
            return (
              <li
                className="pillar"
                data-reveal="idle"
                key={`${story.heading}-${index}`}
                style={stagger(index * 110)}
              >
                <div className="pillar-scan">
                  <h3>{story.heading}</h3>
                  {proof.length > 0 ? (
                    <ul className="pillar-proof">
                      {proof.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="pillar-copy">
                  <p>{story.body}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function OrganizationsSection({ block }: { block: OrganizationsBlock }) {
  const organizations = relatedDocs(block.organizations, isOrganization)
  return (
    <OrgMarks
      className={surfaceClass(block.background, 'paper')}
      heading={block.heading || 'Supported programs and facilities'}
      organizations={organizations}
    />
  )
}

async function FeaturedProjectsSection({ block }: { block: FeaturedProjectsBlock }) {
  const projects = await getFeaturedProjects(4)
  return (
    <FeaturedGrants
      allHref={block.allHref || '/projects-grants'}
      allLabel={block.allLabel || 'All projects and grants'}
      className={surfaceClass(block.background, 'paper')}
      emptyMessage={
        block.emptyMessage ||
        'Project stories will appear here as the board publishes confirmed grants and improvements.'
      }
      heading={block.heading || 'Featured projects and grants'}
      intro={block.intro}
      projects={projects}
    />
  )
}

function PhotoRailSection({ block }: { block: PhotoRailBlock }) {
  const photos = sliderPhotosFrom(block)
  if (photos.length === 0) return null

  const headingId = `photos-${block.id}`

  return (
    <section aria-labelledby={headingId} className={cn('band band-flush', surfaceClass(block.background, 'paper'))}>
      <h2 className="visually-hidden" id={headingId}>
        {block.heading || 'Recreation around town'}
      </h2>
      <PhotoRail photos={photos} />
    </section>
  )
}

async function UpcomingEventsSection({
  block,
  fallbackPhoto,
}: {
  block: UpcomingEventsBlock
  fallbackPhoto: HomePhoto['media'] | null
}) {
  const [settings, upcomingEvents] = await Promise.all([
    getSiteSettings(),
    getUpcomingEvents(block.limit || 3),
  ])
  const facebookUrl = 'facebookUrl' in settings ? settings.facebookUrl : null
  const [nextEvent, ...moreEvents] = upcomingEvents
  const headingId = `events-${block.id}`

  return (
    <section aria-labelledby={headingId} className={cn('band', surfaceClass(block.background, 'tint'))} data-plate="hold">
      <div aria-hidden="true" className="plate-fill" />
      <div className="band-inner">
        {nextEvent ? (
          <>
            <div className="events-lead">
              <div className="events-lead-copy" data-reveal="idle">
                <h2 id={headingId}>{block.heading || 'Upcoming events'}</h2>
              </div>
              <NextEventCard event={nextEvent} photo={fallbackPhoto} revealDelay={80} />
            </div>
            {moreEvents.length > 0 ? (
              <ol className="event-board">
                {moreEvents.map((event, index) => (
                  <EventRow event={event} key={event.id} revealDelay={index * 110} />
                ))}
              </ol>
            ) : null}
            {block.allHref && block.allLabel ? (
              <div className="ledger-footer" data-reveal="idle">
                <Link className="arrow-link" href={block.allHref}>
                  {block.allLabel}
                </Link>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className="band-head">
              <div data-reveal="idle">
                <h2 id={headingId}>{block.heading || 'Upcoming events'}</h2>
              </div>
            </div>
            <div className="pending" data-reveal="idle">
              <h3>{block.emptyHeading || 'Nothing on the calendar right now'}</h3>
              <p>{block.emptyMessage}</p>
              {facebookUrl ? (
                <div className="pending-actions">
                  <a className="button button-secondary" href={facebookUrl} rel="noopener noreferrer" target="_blank">
                    Check Facebook
                    <span className="visually-hidden"> (opens in a new tab, leaves this website)</span>
                  </a>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function DonateCtaSection({ block }: { block: DonateCtaBlock }) {
  const secondary =
    block.secondaryHref?.trim() && block.secondaryLabel?.trim()
      ? { href: block.secondaryHref, label: block.secondaryLabel }
      : null

  return (
    <DonateBand
      body={block.body}
      className={surfaceClass(block.background, 'flare')}
      heading={block.heading}
      headingId={`donate-${block.id}`}
      secondary={secondary}
    />
  )
}

async function ContactSection({
  block,
  fallbackPhoto,
}: {
  block: ContactBlock
  fallbackPhoto: HomePhoto['media'] | null
}) {
  const sectionHeadingId = `contact-${block.id}`
  const formHeadingId = `contact-form-${block.id}`
  const labelledBy = block.statement ? sectionHeadingId : formHeadingId
  const photo = await resolveFormPhoto(block.photo, fallbackPhoto)
  const hasAside = Boolean(block.statement || photo)

  return (
    <section aria-labelledby={labelledBy} className={cn('band sheet-over', surfaceClass(block.background, 'paper'))} id="ask">
      <div className="band-inner">
        <div className={cn('form-shell', hasAside && 'form-shell-split')}>
          {hasAside ? (
            <div data-reveal="idle">
              <FormAside heading={block.statement} headingId={sectionHeadingId} photo={photo} photoPosition={block.photoPosition} />
            </div>
          ) : null}
          <div data-reveal="idle" style={stagger(120)}>
            <ContactForm heading={block.heading || 'Ask a question'} headingId={formHeadingId} intro={block.intro} />
          </div>
        </div>
      </div>
    </section>
  )
}

async function MastheadSection({ block }: { block: MastheadBlock }) {
  const settings = await getSiteSettings()
  const chosen = isMedia(block.photo) ? block.photo : null
  const logoId = isMedia(settings.logo) ? settings.logo.id : undefined
  const gallery = chosen ? [] : await getGalleryPhotos(6, logoId)
  const fallbackIndex = block.photoFallbackIndex ?? 0
  const photo = chosen ?? gallery[fallbackIndex] ?? gallery[0] ?? null

  return <PageMasthead className={surfaceClass(block.background, 'paper')} heading={block.heading} lede={block.lede} photo={photo} />
}

async function BoardListSection({ block }: { block: BoardListBlock }) {
  const [settings, members] = await Promise.all([getSiteSettings(), getBoardMembers()])
  const contactEmail = 'contactEmail' in settings ? settings.contactEmail : null
  const headingId = `board-${block.id}`

  return (
    <section aria-labelledby={headingId} className={cn('band', surfaceClass(block.background, 'paper'))}>
      <div className="band-inner">
        <div className="band-head">
          <div data-reveal="idle">
            <h2 id={headingId}>{members.length > 0 ? block.heading || 'Your neighbours on the board' : 'Roster in confirmation'}</h2>
          </div>
        </div>

        {members.length > 0 ? (
          <ul className="board-grid">
            {members.map((member, index) => (
              <BoardCard key={member.id} member={member} revealDelay={index * 70} />
            ))}
          </ul>
        ) : (
          <div className="pending" data-reveal="idle">
            <h3>{block.emptyHeading || 'The board is confirming its roster'}</h3>
            <p>
              {block.emptyMessage ||
                'Board member listings will appear here once they are confirmed.'}
            </p>
            {block.emptyNote ? <p className="body-note">{block.emptyNote}</p> : null}
            {contactEmail ? (
              <div className="pending-actions">
                <a className="button button-secondary" href={`mailto:${contactEmail}`}>
                  Email the board
                </a>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function BoardCard({ member, revealDelay }: { member: BoardMember; revealDelay: number }) {
  const photo = isMedia(member.photo) ? member.photo : null

  return (
    <li className="board-member" data-reveal="idle" style={stagger(revealDelay)}>
      {photo ? (
        <SiteImage className="board-photo" media={photo} sizes="(min-width: 52rem) 20rem, 46vw" />
      ) : (
        <p aria-hidden="true" className="board-initials">
          {initials(member.name)}
        </p>
      )}
      <div>
        <h3 className="board-name">{member.name}</h3>
        {member.title ? <p className="board-role">{member.title}</p> : null}
      </div>
      {member.bio ? <p className="board-bio">{member.bio}</p> : null}
      {member.website ? (
        <p>
          <a className="arrow-link" href={member.website} rel="noopener noreferrer" target="_blank">
            Profile
            <span className="visually-hidden">
              {' '}
              for {member.name} (opens in a new tab, leaves this website)
            </span>
          </a>
        </p>
      ) : null}
    </li>
  )
}

async function EventListSection({ block }: { block: EventListBlock }) {
  const [settings, events] = await Promise.all([getSiteSettings(), getAllEvents()])
  const facebookUrl = 'facebookUrl' in settings ? settings.facebookUrl : null
  const { upcoming, past } = events
  const upcomingId = `upcoming-${block.id}`
  const pastId = `past-${block.id}`

  return (
    <>
      <section aria-labelledby={upcomingId} className={cn('band', surfaceClass(block.background, 'paper'))}>
        <div className="band-inner">
          <div className="band-head">
            <div data-reveal="idle">
              <h2 id={upcomingId}>{block.upcomingHeading || 'Upcoming events'}</h2>
            </div>
          </div>
          {upcoming.length > 0 ? (
            <ol className="event-list">
              {upcoming.map((event, index) => (
                <EventRow event={event} key={event.id} revealDelay={index * 90} />
              ))}
            </ol>
          ) : (
            <div className="pending" data-reveal="idle">
              <h3>{block.emptyHeading || 'Nothing on the calendar right now'}</h3>
              <p>{block.emptyMessage}</p>
              {facebookUrl ? (
                <div className="pending-actions">
                  <a className="button button-secondary" href={facebookUrl} rel="noopener noreferrer" target="_blank">
                    Check Facebook
                    <span className="visually-hidden"> (opens in a new tab, leaves this website)</span>
                  </a>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {past.length > 0 ? (
        <section aria-labelledby={pastId} className={cn('band', surfaceClass(block.background, 'tint'))}>
          <div className="band-inner">
            <div className="band-head">
              <div data-reveal="idle">
                <h2 id={pastId}>{block.pastHeading || 'Past events'}</h2>
              </div>
            </div>
            <ol className="event-list">
              {past.map((event, index) => (
                <EventRow event={event} key={event.id} past revealDelay={index * 70} />
              ))}
            </ol>
          </div>
        </section>
      ) : null}
    </>
  )
}

async function GrantRequestSection({
  block,
  fallbackPhoto,
}: {
  block: GrantRequestBlock
  fallbackPhoto: HomePhoto['media'] | null
}) {
  const headingId = `grant-request-${block.id}`
  const heading = block.heading || 'Have a Recreation Project We Should Know About?'
  const lede = block.intro || block.statement
  const photo = await resolveFormPhoto(block.photo, fallbackPhoto)

  return (
    <section aria-labelledby={headingId} className={cn('band', surfaceClass(block.background, 'paper'))} id="grant-request">
      <div className="band-inner">
        <div className="form-shell form-shell-split">
          <div data-reveal="idle">
            <FormAside heading={heading} headingId={headingId} lede={lede} photo={photo} photoPosition={block.photoPosition} />
          </div>
          <div data-reveal="idle" style={stagger(120)}>
            <GrantRequestForm heading={heading} headingId={headingId} showHeading={false} />
          </div>
        </div>
      </div>
    </section>
  )
}

function FormAside({
  heading,
  headingId,
  lede,
  photo,
  photoPosition,
}: {
  heading?: string | null
  headingId?: string
  lede?: string | null
  photo?: unknown
  photoPosition?: string | null
}) {
  return (
    <div className="form-aside">
      {heading ? (
        <h2 className="mission-statement" id={headingId}>
          {heading}
        </h2>
      ) : null}
      {lede ? <p className="form-aside-lede">{lede}</p> : null}
      {photo ? (
        <div className="form-aside-figure">
          <SiteImage
            className="form-aside-photo"
            hideWhenEmpty
            media={photo}
            objectPosition={photoPosition}
            sizes="(min-width: 52rem) 24rem, 92vw"
          />
        </div>
      ) : null}
    </div>
  )
}
