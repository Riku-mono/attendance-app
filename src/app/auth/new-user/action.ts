'use server'

import { z } from 'zod'
import { NewUserSettingsSchema } from './new-user-form'
import { auth } from '@/auth'
import getUserById from '@/app/api/user/getUserById'
import prisma from '@/lib/prisma'

export const newUserSettings = async (values: z.infer<typeof NewUserSettingsSchema>) => {
  const session = await auth()

  if (!session) {
    return { error: 'Unauthorized' }
  }

  const dbUser = await getUserById(session.user.id as string)

  if (!dbUser) {
    return { error: 'Unauthorized' }
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      profileInitialized: true,
      profile: {
        upsert: {
          update: {
            firstName: values.firstName,
            lastName: values.lastName,
            campus: {
              connect: {
                id: Number(values.campusId),
              },
            },
          },
          create: {
            firstName: values.firstName,
            lastName: values.lastName,
            campus: {
              connect: {
                id: Number(values.campusId),
              },
            },
          },
        },
      },
    },
  })

  return { success: 'Created user profile successfully!' }
}
