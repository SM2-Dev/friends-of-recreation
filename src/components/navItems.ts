export type NavItem = {
  href: string
  label: string
}

export const primaryNav: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/board-members', label: 'Board Members' },
  { href: '/events', label: 'Events' },
  { href: '/projects-grants', label: 'Projects & Grants' },
]
