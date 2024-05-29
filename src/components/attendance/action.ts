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

  try {
    await prisma.$transaction(async (prisma) => {
      const count = await prisma.attendance.count({
        where: {
          activityId: values.activityId,
        },
      })

      const newAttendance = await prisma.attendance.create({
        data: {
          userId: values.userId,
          activityId: values.activityId,
          sequenceByActivity: count + 1,
        },
      })
    })
    return { success: 'Attended activity successfully!' }
  } catch (error) {
    return { error: 'Failed to attend activity' }
  }
}
