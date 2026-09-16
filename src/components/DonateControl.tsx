import Link from 'next/link'

import { Button } from '@/components/Button'

type DonateControlProps = {
  url?: string | null
  label: string
  pendingLabel?: string
  pendingHref?: string
  pendingVisible?: boolean
  describedById: string
}

export function DonateControl({
  url,
  label,
  pendingLabel = 'Ask how to give',
  pendingHref = '/#ask',
  pendingVisible = false,
  describedById,
}: DonateControlProps) {
  if (url) {
    return (
      <Button className="donate-button" external href={url} variant="primary">
        {label}
      </Button>
    )
  }

  // The board has not confirmed a payment URL yet, and the site will not invent
  // one. Until then the loudest control routes to the volunteers rather than
  // sitting on the page as a dead button.
  return (
    <span className="donate-control">
      <Link
        aria-describedby={describedById}
        className="button button-primary donate-button"
        href={pendingHref}
      >
        {pendingLabel}
      </Link>
      <span className={pendingVisible ? 'donate-pending' : 'visually-hidden'} id={describedById}>
        Online giving is not live yet. Send a note and a volunteer will help you give.
      </span>
    </span>
  )
}
