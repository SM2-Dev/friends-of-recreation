import { CountUpAmount } from '@/components/CountUpAmount'
import type { Project } from '@/payload-types'
import { categoryLabel, isPlainAmount } from '@/lib/display'
import { stagger } from '@/lib/motion'
import { cn } from '@/lib/utils'

type LedgerRowProps = {
  project: Project
  revealDelay?: number
  /** Long form adds the description; the homepage keeps rows to one line of proof. */
  detailed?: boolean
  countUp?: boolean
  /** Year-chaptered ledgers set the year once, so the row does not repeat it. */
  hideYear?: boolean
  titleAs?: 'h3' | 'h4'
}

export function LedgerRow({
  project,
  revealDelay = 0,
  detailed = false,
  countUp = false,
  hideYear = false,
  titleAs = 'h3',
}: LedgerRowProps) {
  const Title = titleAs
  const meta = [categoryLabel(project.category), project.recipient, project.beneficiaries].filter(
    Boolean,
  ) as string[]
  const quiet = !isPlainAmount(project.amountLabel)

  return (
    <li
      className={cn('ledger-row', hideYear && 'ledger-row-bare')}
      data-reveal="idle"
      style={stagger(revealDelay)}
    >
      {hideYear ? null : <p className="ledger-year">{project.year}</p>}

      <div className="ledger-main">
        <Title className="ledger-title">{project.title}</Title>
        {meta.length > 0 ? (
          <p className="ledger-meta">
            {meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </p>
        ) : null}
        {detailed && project.summary ? <p className="ledger-summary">{project.summary}</p> : null}
      </div>

      {project.amountLabel ? (
        <p className={cn('ledger-amount', quiet && 'ledger-amount-quiet')}>
          {countUp && !quiet ? <CountUpAmount value={project.amountLabel} /> : project.amountLabel}
        </p>
      ) : null}
    </li>
  )
}
