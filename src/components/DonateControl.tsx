import Link from 'next/link'

import { Button } from '@/components/Button'

type DonateControlProps = {
  url?: string | null
  label: string
  pendingLabel?: string
  pendingHref?: string
}

export function DonateControl({
  url,
  label,
  pendingLabel,
  pendingHref = '/#ask',
}: DonateControlProps) {
  if (url) {
    return (
      <Button className="donate-button" external href={url} variant="primary">
        {label}
      </Button>
    )
  }

  // Until the board confirms a payment URL, the control still leads somewhere
  // useful: the contact form, using the same donate label.
  return (
    <Link className="button button-primary donate-button" href={pendingHref}>
      {pendingLabel || label}
    </Link>
  )
}
