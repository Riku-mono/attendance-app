import prisma from '@/lib/prisma'
import { type Activity as NextActivitiesCarouselProps } from '@/components/home/next-activites-carousel'
import { type AttendanceProps } from '@/components/attendance/attendance-item'
import { type ActivityProps } from '@/components/activity/activity-item'

export async function getNextActivities({ userCampusId }: { userCampusId: number }) {
  if (!userCampusId) {
    return []
  }

  const res = (await prisma.activity.findMany({
    where: {
      isNormalActivity: true,
      endDateTime: {
        gt: new Date(),
      },
      targets: {
        some: {
          id: userCampusId as number,
        },
      },
    },
    take: 5,
    orderBy: {
      startDateTime: 'asc',
    },
    select: {
      id: true,
      name: true,
      place: true,
      activityType: true,
      startDateTime: true,
      endDateTime: true,
    },
  })) as NextActivitiesCarouselProps[]
  return res
}

export async function getRecentAttendance({ userId }: { userId: string }) {
  if (!userId) {
    return []
  }

  const res = (await prisma.attendance.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      attendDateTime: 'desc',
    },
    take: 3,
    select: {
      id: true,
      attendDateTime: true,
      activity: {
        select: {
          id: true,
          name: true,
          place: true,
          owner: {
            select: {
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
  })) as AttendanceProps[]
  return res
}

export async function getRecentOwnedActivities({ userId }: { userId: string }) {
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
    take: 3,
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
