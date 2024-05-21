import prisma from '@/lib/prisma'

export default async function getUserById(id: string) {
  const res = await prisma.user.findUnique({
    where: {
      id,
    },
  })
  return res
}
