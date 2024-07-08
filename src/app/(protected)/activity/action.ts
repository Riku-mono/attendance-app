import prisma from '@/lib/prisma'
import { type ActivityProps } from '@/components/activity/activity-item'

export async function getOwnedActivities({ userId }: { userId: string }) {
  if (!userId) {
    return []
  }

  const res = (await prisma.activity.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      place: true,
      activityType: true,
      startDateTime: true,
      endDateTime: true,
    },
  })) as ActivityProps[]
  return res
}
