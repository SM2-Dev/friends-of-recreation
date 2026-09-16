import { SiteImage } from '@/components/SiteImage'
import { stagger } from '@/lib/motion'
import { cn, isMedia } from '@/lib/utils'
import type { Organization } from '@/payload-types'

type OrgMarksProps = {
  heading: string
  organizations: Organization[]
  className?: string
}

export function OrgMarks({ heading, organizations, className }: OrgMarksProps) {
  if (organizations.length === 0) return null

  return (
    <section aria-labelledby="orgs-heading" className={cn('band plane-over', className)}>
      <div className="band-inner">
        <div className="band-head">
          <div data-reveal="idle">
            <h2 id="orgs-heading">{heading}</h2>
          </div>
        </div>

        <ul className="org-marks">
          {organizations.map((organization, index) => (
            <li
              data-reveal="idle"
              key={organization.id}
              style={stagger(Math.min(index, 6) * 80)}
            >
              <OrgMark organization={organization} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function OrgMark({ organization }: { organization: Organization }) {
  const logo = isMedia(organization.logo) && organization.logo.url ? organization.logo : null
  const body = (
    <>
      {logo ? (
        <SiteImage
          className="org-mark-logo"
          fit="contain"
          hideWhenEmpty
          media={logo}
          sizes="(min-width: 52rem) 12rem, 70vw"
        />
      ) : null}
      <span className={logo ? 'org-mark-name org-mark-caption' : 'org-mark-name'}>
        {organization.name}
        {organization.website ? (
          <span className="visually-hidden"> (opens in a new tab, leaves this website)</span>
        ) : null}
      </span>
    </>
  )

  const className = cn('org-mark', logo && 'org-mark-has-logo')

  if (organization.website) {
    return (
      <a className={className} href={organization.website} rel="noopener noreferrer" target="_blank">
        {body}
      </a>
    )
  }

  return <div className={className}>{body}</div>
}
