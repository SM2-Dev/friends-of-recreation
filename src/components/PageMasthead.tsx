import { SiteImage } from '@/components/SiteImage'
import { stagger } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { Media } from '@/payload-types'

type PageMastheadProps = {
  heading: string
  lede?: string | null
  photo?: Media | null
  className?: string
}

/**
 * Inner-route opening: display title and a supporting photographic plate.
 * The plate sits beside the type from 52rem so the page's actual records
 * (board, events, ledger) can begin in the first viewport.
 */
export function PageMasthead({ heading, lede, photo, className }: PageMastheadProps) {
  return (
    <section className={cn('masthead', className)}>
      <div className="masthead-inner">
        <div className="masthead-copy">
          <h1 className="enter">{heading}</h1>
          {lede ? (
            <p className="masthead-lede enter" style={stagger(80)}>
              {lede}
            </p>
          ) : null}
        </div>
        {photo ? (
          <div className="masthead-figure">
            <SiteImage
              className="masthead-photo enter-panel"
              hideWhenEmpty
              media={photo}
              priority
              sizes="(min-width: 52rem) 18rem, 92vw"
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
