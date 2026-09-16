'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { NavItem } from '@/components/navItems'

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary" className="desktop-nav">
      <ul>
        {items.map((item) => {
          const current = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

          return (
            <li key={item.href}>
              <Link aria-current={current ? 'page' : undefined} href={item.href}>
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
