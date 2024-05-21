import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'
const { auth } = NextAuth(authConfig)

const ROOT = '/'
const PUBLIC_ROUTES = ['/', '/auth/login']
const DEFAULT_REDIRECT = '/home'

export default auth((req) => {
  const { nextUrl } = req
  const session = req.auth

  const isAuthenticated = !!req.auth
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname)

  if (isAuthenticated) {
    if (session?.user.profileInitialed === false) {
      if (nextUrl.pathname === '/auth/logout') {
        return
      }
      if (nextUrl.pathname !== '/auth/new-user') {
        return Response.redirect(new URL('/auth/new-user', nextUrl))
      }
    }
    if (session?.user.profileInitialed === true && nextUrl.pathname === '/auth/new-user') {
      return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl))
    }
    if (isPublicRoute) return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl))
  }

  if (!isAuthenticated && !isPublicRoute) return Response.redirect(new URL(ROOT, nextUrl))
})

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'],
}
