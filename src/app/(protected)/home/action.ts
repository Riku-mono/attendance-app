import prisma from '@/lib/prisma'
import { type Activity as NextActivitiesCarouselProps } from '@/components/home/next-activites-carousel'
import { type Attendance as RecentAttendance } from '@/components/home/recent-attendance'
import { type Activity as RecentOwnedActivitiesProps } from '@/components/home/recent-owned-activities'

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
      place: {
        select: {
          name: true,
        },
      },
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
          place: {
            select: {
              name: true,
            },
          },
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
  })) as RecentAttendance[]
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
      place: {
        select: {
          name: true,
        },
      },
      activityType: true,
      startDateTime: true,
      endDateTime: true,
    },
  })) as RecentOwnedActivitiesProps[]
  return res
}
