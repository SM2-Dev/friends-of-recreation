import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  title: string
  lede?: string | null
  className?: string
  titleAs?: 'h1' | 'h2'
}

export function SectionHeading({ title, lede, className, titleAs: Title = 'h2' }: SectionHeadingProps) {
  return (
    <header className={cn('section-heading', className)}>
      <Title className="section-heading-title">{title}</Title>
      {lede ? <p className="section-heading-lede">{lede}</p> : null}
    </header>
  )
}
