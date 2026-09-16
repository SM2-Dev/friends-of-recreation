import { DonateBand } from '@/components/DonateBand'
import { GrantRequestForm } from '@/components/GrantRequestForm'
import { LedgerRow } from '@/components/LedgerRow'
import { PageMasthead } from '@/components/PageMasthead'
import { getGalleryPhotos, getPageContent, getProjects, getSiteSettings } from '@/lib/cms'
import { projectSpan } from '@/lib/display'
import { stagger } from '@/lib/motion'
import { isMedia } from '@/lib/utils'

export const metadata = {
  title: 'Projects and grants',
  description:
    'What Friends of Recreation has funded in Saratoga Springs: playgrounds, athletic facilities, youth equipment, camps, and community recreation projects.',
}

export default async function ProjectsGrantsPage() {
  const [content, settings, projects] = await Promise.all([
    getPageContent(),
    getSiteSettings(),
    getProjects(),
  ])

  const logoId = isMedia(settings.logo) ? settings.logo.id : undefined
  // Each inner page takes a different photograph from the gallery so the
  // mastheads do not repeat as a visitor moves through the site.
  const gallery = await getGalleryPhotos(6, logoId)
  const banner = gallery[3] ?? gallery[0] ?? null
  const span = projectSpan(projects)

  return (
    <>
      <PageMasthead
        heading={content?.projects?.heading || 'See Your Support in Action'}
        lede={content?.projects?.intro}
        photo={banner}
      />

      <section aria-labelledby="funded-heading" className="band band-tint">
        <div className="band-inner">
          <div className="band-head band-head-split">
            <div data-reveal="idle">
              <h2 id="funded-heading">
                {span ? `Everything funded, ${span.first} to ${span.latest}` : 'What we have funded'}
              </h2>
            </div>
            {span ? (
              <div className="band-head-aside" data-reveal="idle" style={stagger(120)}>
                <p className="ledger-note">
                  {span.count} projects and grants are published here, newest first, with the funding
                  detail the board has approved for release.
                </p>
              </div>
            ) : null}
          </div>

          {projects.length > 0 ? (
            <ol className="ledger">
              {projects.map((project, index) => (
                <LedgerRow detailed key={project.id} project={project} revealDelay={index * 55} />
              ))}
            </ol>
          ) : (
            <div className="pending" data-reveal="idle">
              <h3>The published record is being confirmed</h3>
              <p>
                {content?.projects?.emptyMessage ||
                  'Project stories will appear here as the board publishes confirmed grants and improvements.'}
              </p>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="grant-request-heading" className="band band-paper" id="grant-request">
        <div className="band-inner">
          <div className="form-shell form-shell-split">
            <div data-reveal="idle">
              <p className="label">Ask for support</p>
              <h2 className="mission-statement">
                If a Saratoga Springs project needs a push, we would rather hear about it than miss
                it.
              </h2>
            </div>
            <div data-reveal="idle" style={stagger(120)}>
              <GrantRequestForm
                heading={
                  content?.projects?.grantHeading ||
                  'Have a Recreation Project We Should Know About?'
                }
                intro={content?.projects?.grantIntro}
              />
            </div>
          </div>
        </div>
      </section>

      <DonateBand
        headingId="projects-donate-heading"
        secondary={{ href: '/events', label: 'See upcoming events' }}
      />
    </>
  )
}
