import { Button } from '@/components/Button'

type DonateControlProps = {
  url?: string | null
  label: string
  pendingVisible?: boolean
  describedById: string
}

export function DonateControl({ url, label, pendingVisible = false, describedById }: DonateControlProps) {
  if (url) {
    return (
      <Button className="donate-button" external href={url} variant="primary">
        {label}
      </Button>
    )
  }

  return (
    <span className="donate-control">
      <Button ariaDescribedBy={describedById} className="donate-button" disabled>
        {label}
      </Button>
      <span className={pendingVisible ? 'donate-pending' : 'visually-hidden'} id={describedById}>
        Donation page pending board confirmation.
      </span>
    </span>
  )
}
