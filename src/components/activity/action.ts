import prisma from '@/lib/prisma'

export async function getActivity(id: string) {
  const res = await prisma.activity.findUnique({
    where: { id: id },
    select: {
      id: true,
      name: true,
      description: true,
      owner: {
        select: {
          id: true,
          name: true,
          image: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      targets: {
        select: { id: true, name: true, color: true },
      },
      activityType: true,
      place: true,
      startDateTime: true,
      endDateTime: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  return res
}
