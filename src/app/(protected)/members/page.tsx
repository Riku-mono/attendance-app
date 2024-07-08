import prisma from '@/lib/prisma'
import Image from 'next/image'

type searchMembersParams = {
  q?: string
  target?: string
  page?: number
  sort?: string
}

export default async function MembersPage({ searchParams }: { searchParams: searchMembersParams }) {
  const { q, target, page = 1, sort } = searchParams
  const formatedQ = decodeURIComponent(q || '').split(' OR ') || []

  const campuses = await prisma.campus.findMany()

  const members = await prisma.user.findMany({
    where: {
      OR: formatedQ.map((q) => ({
        OR: [{ name: { contains: q } }],
      })),
      profileInitialized: true,
    },
    select: {
      id: true,
      name: true,
      image: true,
      role: true,
      campusId: true,
    },
    take: 10,
    skip: (page - 1) * 10,
    orderBy: {
      name: sort === 'asc' ? 'asc' : 'desc',
    },
  })

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4">
      <h1 className="text-3xl font-semibold">Members</h1>
      <p className="text-sm text-gray-500">Search for members</p>
      <p className="text-sm text-gray-500">q: {q}</p>
      <p className="text-sm text-gray-500">target: {target}</p>
      <p className="text-sm text-gray-500">page: {page}</p>
      <p className="text-sm text-gray-500">sort: {sort}</p>
      <ul>
        {members.map((member) => (
          <li key={member.id} className="a flex items-center gap-2 p-2">
            <Image
              src={member.image || ''}
              width={32}
              height={32}
              className="rounded-full"
              alt="User Image"
            />
            <p>{member.name}</p>
            <p>{member.role}</p>
            <p>{campuses[member.campusId as number].name}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
