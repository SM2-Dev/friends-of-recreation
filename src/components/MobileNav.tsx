'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'

import { Button } from '@/components/Button'
import type { NavItem } from '@/components/navItems'

type MobileNavProps = {
  items: NavItem[]
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }

    const firstLink = document.querySelector<HTMLAnchorElement>(`#${CSS.escape(panelId)} a`)
    firstLink?.focus()
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, panelId])

  return (
    <div className="mobile-nav">
      <Button
        ariaControls={panelId}
        ariaExpanded={open}
        className="mobile-nav-toggle"
        onClick={() => setOpen((current) => !current)}
        ref={toggleRef}
        variant="nav"
      >
        {open ? 'Close menu' : 'Menu'}
      </Button>
      <div className="mobile-nav-panel" hidden={!open} id={panelId}>
        <nav aria-label="Primary mobile">
          <ul className="mobile-nav-list">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
