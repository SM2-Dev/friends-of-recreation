import type { ReactNode, Ref } from 'react'
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
  ariaDescribedBy?: string
  disabled?: boolean
  busy?: boolean
  ref?: Ref<HTMLButtonElement>
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
  ariaDescribedBy,
  disabled,
  busy,
  ref,
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
      aria-busy={busy || undefined}
      aria-controls={ariaControls}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
      type={type}
    >
      {children}
    </button>
  )
}
