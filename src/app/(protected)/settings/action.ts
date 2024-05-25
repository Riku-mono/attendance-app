'use server'

import { z } from 'zod'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import getUserById from '@/app/api/user/getUserById'
import { NameSettingSchema } from './name-setting-form'
import { CampusSettingSchema } from './campus-setting-form'

export const nameSetting = async (values: z.infer<typeof NameSettingSchema>) => {
  const session = await auth()

  if (!session) {
    return { error: 'Unauthorized' }
  }

  const dbUser = await getUserById(session.user.id as string)

  if (!dbUser) {
    return { error: 'Unauthorized' }
  }

  await prisma.profile.update({
    where: {
      userId: session.user.id,
    },
    data: {
      firstName: values.firstName,
      lastName: values.lastName,
    },
  })

  return { success: 'Updated name successfully!' }
}

export const campusSetting = async (values: z.infer<typeof CampusSettingSchema>) => {
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
      campusId: parseInt(values.campusId),
    },
  })

  return { success: 'Updated campus successfully!' }
}
