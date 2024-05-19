'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  {
    href: '/settings',
    label: 'General',
  },
  {
    href: '/settings/display',
    label: 'Display',
  },
  {
    href: '/auth/logout',
    label: 'Log out',
  },
]

export default function NavLinks() {
  const pathname = usePathname()
  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={pathname === link.href ? 'font-semibold text-primary' : undefined}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
