import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'

import { cn } from '@/lib/utils'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'

import { ThemeProvider } from '@/components/theme-provider'

import { ModeToggle } from '@/components/theme-toggle-btn'
import { NavLinks, MbNavLinks } from '@/components/header/nav-links'
import { Toaster } from 'sonner'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Horizon Attendance App',
  description: 'is a simple attendance app for Horizon Members',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-screen flex-col bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="sticky top-0 z-50 flex h-16 items-center gap-4 bg-muted/40 px-4 md:border-b md:bg-background md:px-6">
              <div className="container flex h-14 max-w-screen-2xl items-center p-0">
                {session?.user.profileInitialized ? <NavLinks /> : null}
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                  <div></div>
                  <ModeToggle />
                </div>
              </div>
            </header>
            <main className="relative flex min-h-[calc(100vh_-_theme(spacing.32))] flex-1 flex-col gap-4 overflow-x-hidden bg-muted/40 p-4 md:min-h-[calc(100vh_-_theme(spacing.16))] md:gap-8 md:p-10">
              {children}
            </main>
            {session?.user.profileInitialized ? <MbNavLinks /> : null}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
