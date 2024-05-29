'use server'

import { z } from 'zod'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import getUserById from '@/app/api/user/getUserById'
import { AttendActivitySchema } from './attend-form'

export const attendActivity = async (values: z.infer<typeof AttendActivitySchema>) => {
  const session = await auth()

  if (!session) {
    return { error: 'Unauthorized' }
  }

  const dbUser = await getUserById(session.user.id as string)

  if (!dbUser) {
    return { error: 'Unauthorized' }
  }

  await prisma.attendance.create({
    data: {
      userId: values.userId,
      activityId: values.activityId,
    },
  })

  return { success: 'Attended activity successfully!' }
}
