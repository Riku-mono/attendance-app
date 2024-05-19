'use client'

import { HomeIcon, CircleUserRound, QrCode, PackageIcon, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/home', icon: HomeIcon, label: 'Home' },
  { href: '/attendance', icon: PackageIcon, label: 'Attendance' },
  { href: '/members', icon: Users, label: 'Members' },
  { href: '/settings', icon: CircleUserRound, label: 'Settings' },
]

export const NavLinks = () => {
  const pathname = usePathname()
  return (
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            pathname.includes(link.href)
              ? 'text-foreground transition-colors hover:text-foreground'
              : 'text-muted-foreground transition-colors hover:text-foreground'
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

export const MbNavLinks = () => {
  const pathname = usePathname()
  return (
    <nav className="sticky bottom-0 z-50 grid h-16 w-full grid-cols-5 justify-around border-t bg-background px-4 pt-2 md:hidden md:px-6">
      {links.slice(0, 2).map(({ href, icon: Icon, label }) => (
        <Link className="flex flex-col items-center gap-1" key={href} href={href}>
          <Icon
            className={`h-6 w-6 ${pathname.includes(href) ? 'fill-foreground/30 text-foreground' : ''}`}
          />
          {label && (
            <span
              className={`text-xs ${pathname.includes(href) ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {label}
            </span>
          )}
        </Link>
      ))}

      <div className="">
        <Link
          className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground p-4"
          href="/qr-scan"
        >
          <QrCode
            className={`h-6 w-6 text-primary-foreground ${pathname.includes('/qr-scan') ? 'fill-foreground/30 text-foreground' : ''}`}
          />
        </Link>
      </div>

      {links.slice(2).map(({ href, icon: Icon, label }) => (
        <Link className="flex flex-col items-center gap-1" key={href} href={href}>
          <Icon
            className={`h-6 w-6 ${pathname.includes(href) ? 'fill-foreground/30 text-foreground' : ''}`}
          />
          {label && (
            <span
              className={`text-xs ${pathname.includes(href) ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {label}
            </span>
          )}
        </Link>
      ))}
    </nav>
  )
}
