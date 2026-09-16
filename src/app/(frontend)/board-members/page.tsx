import { DonateBand } from '@/components/DonateBand'
import { PageMasthead } from '@/components/PageMasthead'
import { SiteImage } from '@/components/SiteImage'
import { getBoardMembers, getGalleryPhotos, getPageContent, getSiteSettings } from '@/lib/cms'
import { stagger } from '@/lib/motion'
import { isMedia } from '@/lib/utils'
import type { BoardMember } from '@/payload-types'

export const metadata = {
  title: 'Board members',
  description:
    'The volunteer board behind Saratoga Springs Friends of Recreation, the community members who raise funds for local recreation.',
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default async function BoardMembersPage() {
  const [content, settings, members] = await Promise.all([
    getPageContent(),
    getSiteSettings(),
    getBoardMembers(),
  ])

  const logoId = isMedia(settings.logo) ? settings.logo.id : undefined
  // Each inner page takes a different photograph from the gallery so the
  // mastheads do not repeat as a visitor moves through the site.
  const gallery = await getGalleryPhotos(6, logoId)
  const banner = gallery[1] ?? gallery[0] ?? null
  const contactEmail = 'contactEmail' in settings ? settings.contactEmail : null

  return (
    <>
      <PageMasthead
        heading={content?.board?.heading || 'Meet the Friends Behind the Mission'}
        lede={content?.board?.intro}
        photo={banner}
      />

      <section aria-labelledby="board-heading" className="band band-paper">
        <div className="band-inner">
          <div className="band-head">
            <div data-reveal="idle">
              <h2 id="board-heading">
                {members.length > 0 ? 'Your neighbours on the board' : 'Roster in confirmation'}
              </h2>
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
              <h3>The board is confirming its roster</h3>
              <p>
                {content?.board?.emptyMessage ||
                  'Board member listings will appear here once they are confirmed.'}
              </p>
              <p className="body-note">
                Names, roles, and photographs are published only after the volunteers themselves
                approve them, so nothing is guessed at here.
              </p>
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

      <DonateBand
        headingId="board-donate-heading"
        secondary={{ href: '/#ask', label: 'Ask a question' }}
      />
    </>
  )
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
