import NextAuth, { type DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  id: string
  role: string
  profileInitialed: boolean
}
declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}
