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
      const userId = await getUserId(profile.id.toString())
      const user = await getUser(userId as string)
      if (!user) {
        return {
          id: profile.id.toString(),
          name: profile.login,
          email: profile.email ?? null,
          image: profile.avatar_url,
          role: 'USER',
          profileInitialized: false,
          campusId: null,
        }
      }
      const role = user.role
      const profileInitialized = user.profileInitialized
      const campusId = user.campusId
      return {
        id: profile.id.toString(),
        name: profile.login,
        email: profile.email ?? null,
        image: profile.avatar_url,
        role: role,
        profileInitialized: profileInitialized,
        campusId: campusId,
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
        token.profileInitialized = user.profileInitialized
        token.campusId = user.campusId
      }
      if (trigger === 'update') {
        const dbUser = await prisma.user.findUnique({
          where: {
            id: token.id as string,
          },
        })
        if (dbUser) {
          token.role = dbUser.role
          token.profileInitialized = dbUser.profileInitialized
          token.campusId = dbUser.campusId
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.profileInitialized = token.profileInitialized as boolean
        session.user.campusId = token.campusId as number
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

async function getUserId(githubId: string) {
  const user = await prisma.account.findUnique({
    where: {
      providerAccountId: githubId,
    },
  })
  if (user) {
    return user.userId
  }
  return null
}

async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
      profileInitialized: true,
      campusId: true,
    },
  })
  if (user) {
    return user
  }
  return null
}
