import prisma from '@/lib/prisma'
import { type AttendanceProps } from '@/components/attendance/attendance-item'

export async function getAttendance({ userId }: { userId: string }) {
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
