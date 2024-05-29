import prisma from '@/lib/prisma'

export default async function getUserAttended(userId: string, activityId: string) {
  const res = await prisma.attendance.findFirst({
    where: {
      userId,
      activityId,
    },
    select: {
      sequenceByActivity: true,
    },
  })
  return res
}
