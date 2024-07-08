import prisma from '@/lib/prisma'

export default async function getActivity(id: string) {
  const res = await prisma.activity.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      isNormalActivity: true,
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
      activityType: true,
      targets: {
        select: { id: true, name: true, color: true },
      },
      place: true,
      startDateTime: true,
      endDateTime: true,
    },
  })
  return res
}
