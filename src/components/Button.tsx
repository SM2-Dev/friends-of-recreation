import type { ReactNode } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

type ButtonProps = {
  href?: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'nav'
  external?: boolean
  className?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  ariaExpanded?: boolean
  ariaControls?: string
}

export function Button({
  href,
  children,
  variant = 'primary',
  external,
  className,
  type = 'button',
  onClick,
  ariaExpanded,
  ariaControls,
}: ButtonProps) {
  const classes = cn('button', `button-${variant}`, className)

  if (href) {
    if (external) {
      return (
        <a className={classes} href={href} rel="noopener noreferrer" target="_blank">
          {children}
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      )
    }

    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    )
  }

  return (
    <button
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      className={classes}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}
