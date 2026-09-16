import Link from 'next/link'

import { CountUpAmount } from '@/components/CountUpAmount'
import { LedgerRow } from '@/components/LedgerRow'
import { SiteImage } from '@/components/SiteImage'
import { categoryLabel, isPlainAmount } from '@/lib/display'
import { stagger } from '@/lib/motion'
import { cn, isMedia } from '@/lib/utils'
import type { Project } from '@/payload-types'

type FeaturedGrantsProps = {
  heading: string
  intro?: string | null
  projects: Project[]
  emptyMessage: string
}

export function FeaturedGrants({ heading, intro, projects, emptyMessage }: FeaturedGrantsProps) {
  const [lead, ...rest] = projects

  return (
    <section aria-labelledby="projects-heading" className="band band-paper">
      <div className="band-inner">
        <div className="band-head">
          <div data-reveal="idle">
            <h2 id="projects-heading">{heading}</h2>
            {intro ? <p className="grant-lede">{intro}</p> : null}
          </div>
        </div>

        {lead ? (
          <>
            <GrantFeature project={lead} />
            {rest.length > 0 ? (
              <ol className="ledger grant-follow">
                {rest.map((project, index) => (
                  <LedgerRow countUp key={project.id} project={project} revealDelay={index * 70} />
                ))}
              </ol>
            ) : null}
            <div className="ledger-footer" data-reveal="idle">
              <Link className="arrow-link" href="/projects-grants">
                All projects and grants
              </Link>
            </div>
          </>
        ) : (
          <p className="ledger-note">{emptyMessage}</p>
        )}
      </div>
    </section>
  )
}

function GrantFeature({ project }: { project: Project }) {
  const image = isMedia(project.image) && project.image.url ? project.image : null
  const meta = [categoryLabel(project.category), project.recipient, project.beneficiaries].filter(
    Boolean,
  ) as string[]
  const quiet = !isPlainAmount(project.amountLabel)

  return (
    <article className="grant-feature" data-reveal="idle">
      {image ? (
        <SiteImage
          className="grant-feature-photo"
          hideWhenEmpty
          media={image}
          sizes="(min-width: 52rem) 48vw, 92vw"
        />
      ) : null}
      <div className="grant-feature-copy">
        <p className="grant-feature-year">
          <span className="visually-hidden">Funded in </span>
          {project.year}
        </p>
        <h3 className="grant-feature-title">{project.title}</h3>
        {project.amountLabel ? (
          <p className={cn('grant-feature-amount', quiet && 'grant-amount-quiet')}>
            {quiet ? project.amountLabel : <CountUpAmount value={project.amountLabel} />}
          </p>
        ) : null}
        {meta.length > 0 ? (
          <p className="grant-feature-meta">
            {meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </p>
        ) : null}
        {project.summary ? <p className="grant-feature-summary">{project.summary}</p> : null}
      </div>
    </article>
  )
}
