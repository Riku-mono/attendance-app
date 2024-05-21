import type { NextAuthConfig } from 'next-auth'
import type { Provider } from 'next-auth/providers'
import GitHub from 'next-auth/providers/github'
import prisma from '@/lib/prisma'

const providers: Provider[] = [
  GitHub({
    authorization: {
      params: {
        scope: 'user:email read:org',
      },
    },
    async profile(profile) {
      const role = await getRole(profile.id.toString())
      const profileInitialed = await checkProfileInitialed(profile.id.toString())
      return {
        id: profile.id.toString(),
        name: profile.login,
        email: profile.email ?? null,
        image: profile.avatar_url,
        role: role,
        profileInitialed: profileInitialed,
      }
    },
  }),
]

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider()
    return { id: providerData.id, name: providerData.name }
  } else {
    return { id: provider.id, name: provider.name }
  }
})

export const authConfig = {
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      const accessToken = account?.access_token as string
      const orgs = await getGitHubUserOrgs(accessToken)
      const isMember = orgs.some((org: { login: string }) => org.login === process.env.GITHUB_ORG)
      if (!isMember) {
        return false
      }
      return true
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.profileInitialed = user.profileInitialed
      }
      if (trigger === 'update') {
        const dbUser = await prisma.user.findUnique({
          where: {
            id: token.id as string,
          },
        })
        if (dbUser) {
          token.role = dbUser.role
          token.profileInitialed = dbUser.profileInitialed
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.profileInitialed = token.profileInitialed as boolean
      }
      return session
    },
    redirect({ url, baseUrl }) {
      return baseUrl
    },
  },
} satisfies NextAuthConfig

async function getGitHubUserOrgs(accessToken: string) {
  const response = await fetch('https://api.github.com/user/orgs', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.json()
}

async function getRole(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })
  if (user) {
    return user.role
  }
  return 'USER'
}

async function checkProfileInitialed(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      profileInitialed: true,
    },
  })
  if (user) {
    return user.profileInitialed
  }
  return false
}
