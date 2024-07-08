'use server'

import { z } from 'zod'
import { ActivityEditSchema } from './activity-edit-form'
import { auth } from '@/auth'
import getUserById from '@/app/api/user/getUserById'
import prisma from '@/lib/prisma'

export const editActivity = async (values: z.infer<typeof ActivityEditSchema>) => {
  const session = await auth()

  if (!session) {
    return { error: 'Unauthorized' }
  }

  const dbUser = await getUserById(session.user.id as string)

  if (!dbUser) {
    return { error: 'Unauthorized' }
  }

  if (values.startDateTime && values.endDateTime && values.startDateTime > values.endDateTime) {
    return { error: 'Start date time must be before end date time' }
  }

  const activity = await prisma.activity.update({
    where: {
      id: values.activityID,
    },
    data: {
      name: values.title,
      description: values.description,
      isNormalActivity: values.isNormalActivity,
      activityType: values.activityType,
      place: values.place,
      startDateTime: values.startDateTime as Date,
      endDateTime: values.endDateTime as Date,
      targets: {
        connect: values.targets.map((target) => ({ id: Number(target.value) })) || [],
      },
      owner: {
        connect: { id: dbUser.id },
      },
    },
  })

  return { id: activity.id, success: 'editd activity successfully!' }
}
