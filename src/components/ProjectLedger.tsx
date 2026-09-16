import { CountUpAmount } from '@/components/CountUpAmount'
import { LedgerRow } from '@/components/LedgerRow'
import {
  categoryLabel,
  groupProjectsByYear,
  isPlainAmount,
  latestProjectInCategory,
  projectSpan,
} from '@/lib/display'
import { publicProjectGroups } from '@/lib/projectCategories'
import { stagger } from '@/lib/motion'
import { getProjects } from '@/lib/cms'
import { surfaceClass } from '@/lib/surfaces'
import { cn } from '@/lib/utils'
import type { Project, ProjectLedgerBlock } from '@/payload-types'

type YearGroup = ReturnType<typeof groupProjectsByYear>[number]

export async function ProjectLedger({ block }: { block: ProjectLedgerBlock }) {
  const projects = await getProjects()
  const span = projectSpan(projects)
  const headingId = `funded-${block.id}`
  const scopeId = `funded-scope-${block.id}`
  const heading =
    block.heading ||
    (span ? `Everything funded, ${span.first} to ${span.latest}` : 'What we have funded')
  const categoryHeading = block.categoryHeading || 'What we fund'
  const years = groupProjectsByYear(projects)

  return (
    <>
      <section aria-labelledby={scopeId} className="band surface-tint">
        <div className="band-inner">
          <div className="band-head">
            <div data-reveal="idle">
              <h2 id={scopeId}>{categoryHeading}</h2>
              {block.categoryIntro ? <p className="pillar-lede">{block.categoryIntro}</p> : null}
            </div>
          </div>
          <ul className="fund-scope">
            {publicProjectGroups.map((category, index) => {
              const latest = latestProjectInCategory(projects, category.value)
              return (
                <li className="fund-item" data-reveal="idle" key={category.value} style={stagger(index * 70)}>
                  <h3>{category.label}</h3>
                  {latest ? (
                    <p>
                      <span className="visually-hidden">Latest published: </span>
                      {latest.title}
                    </p>
                  ) : (
                    <p className="fund-empty">None published yet</p>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby={headingId} className={cn('band', surfaceClass(block.background, 'field'))}>
        <div className="band-inner">
          <div className="band-head band-head-split">
            <div data-reveal="idle">
              <h2 id={headingId}>{heading}</h2>
            </div>
            {span ? (
              <div className="band-head-aside" data-reveal="idle" style={stagger(120)}>
                <p className="ledger-note">
                  {span.count} projects and grants are published here, newest first.{' '}
                  {block.confirmationNote ||
                    'Years, amounts, and wording are starter history pending board confirmation.'}
                </p>
              </div>
            ) : null}
          </div>

          {years.length > 0 ? (
            <div className="year-ledger">
              {years.map((group, index) => {
                const [only] = group.projects
                if (only && group.projects.length === 1) {
                  return <YearFeature key={group.year} project={only} revealDelay={index * 70} />
                }

                return <YearChapter group={group} key={group.year} revealDelay={index * 70} />
              })}
            </div>
          ) : (
            <div className="pending" data-reveal="idle">
              <h3>{block.emptyHeading || 'The published record is being confirmed'}</h3>
              <p>
                {block.emptyMessage ||
                  'Project stories will appear here as the board publishes confirmed grants and improvements.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function YearFeature({ project, revealDelay }: { project: Project; revealDelay: number }) {
  const meta = [categoryLabel(project.category), project.recipient, project.beneficiaries].filter(
    Boolean,
  ) as string[]
  const quiet = !isPlainAmount(project.amountLabel)

  return (
    <article className="year-feature" data-reveal="idle" style={stagger(revealDelay)}>
      <p className="year-feature-year">
        <span className="visually-hidden">Funded in </span>
        {project.year}
      </p>
      <div className="year-feature-main">
        <h3 className="year-feature-title">{project.title}</h3>
        {meta.length > 0 ? (
          <p className="ledger-meta">
            {meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </p>
        ) : null}
        {project.summary ? <p className="ledger-summary">{project.summary}</p> : null}
      </div>
      {project.amountLabel ? (
        <p className={cn('ledger-amount', quiet && 'ledger-amount-quiet')}>
          {quiet ? project.amountLabel : <CountUpAmount value={project.amountLabel} />}
        </p>
      ) : null}
    </article>
  )
}

function YearChapter({ group, revealDelay }: { group: YearGroup; revealDelay: number }) {
  return (
    <section aria-labelledby={`year-${group.year}`} className="year-chapter" data-reveal="idle" style={stagger(revealDelay)}>
      <h3 className="year-chapter-year" id={`year-${group.year}`}>
        {group.year}
      </h3>
      <ol className="ledger">
        {group.projects.map((project, index) => (
          <LedgerRow countUp detailed hideYear key={project.id} project={project} revealDelay={index * 45} titleAs="h4" />
        ))}
      </ol>
    </section>
  )
}
