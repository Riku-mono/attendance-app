import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { ChevronLeft, PencilIcon, QrCodeIcon } from 'lucide-react'
import AttendLinkDialog from '@/components/attend-link-dialog'
import PublicActivityCard from '@/components/activity/public-activity-card'
import { Suspense } from 'react'
import ActivityLoading from '@/components/activity/loading'

export default async function ActivityDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const session = await auth()
  const activity = await prisma.activity.findUnique({
    where: { id },
    select: {
      id: true,
      owner: {
        select: {
          id: true,
        },
      },
      targets: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      activityType: true,
      startDateTime: true,
      endDateTime: true,
    },
  })
  if (!activity) {
    return notFound()
  }

  const isOwner = session?.user?.id === activity?.owner.id
  if (!isOwner) {
    return notFound()
  }

  const attendance = await prisma.attendance.findMany({
    where: { activityId: id },
    select: {
      id: true,
      user: {
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
          campusId: true,
        },
      },
      attendDateTime: true,
    },
    orderBy: { attendDateTime: 'desc' },
  })

  const attendanceStats = attendance.reduce(
    (acc, a) => {
      const target = activity.targets.find((target) => target.id === a.user?.campusId)
      const campus = target ?? { id: 999, name: 'Else', color: '#71717A' }
      const index = acc.findIndex((item) => item.campus.id === campus.id)
      if (index === -1) {
        acc.push({ campus, count: 1 })
      } else {
        acc[index].count++
      }
      return acc
    },
    [] as { campus: { id: number; name: string; color: string }; count: number }[]
  )

  const now = new Date()
  const isAvailable =
    now.getTime() >= (activity?.startDateTime?.getTime() ?? 0) - 10 * 60 * 1000 &&
    now.getTime() <= (activity?.endDateTime?.getTime() ?? 0)

  return (
    <>
      <header className="mx-auto grid w-full max-w-7xl gap-4">
        <Breadcrumb className="flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/activity">Activities</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Activity</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon" className="h-7 w-7">
              <Link href="/activity">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-semibold">Activity</h1>
            {isAvailable && (
              <span className="ml-1 inline-block h-2 w-2 rounded-full bg-green-500" />
            )}
          </div>
          {isOwner && (
            <div className="flex flex-wrap gap-2">
              {isAvailable && activity.activityType === 'OFFLINE' && (
                <Button asChild variant="outline" className="gap-2" size="sm">
                  <Link href={`/activity/${activity.id}/qr-code`}>
                    <QrCodeIcon className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Generate Attend QR Code
                    </span>
                  </Link>
                </Button>
              )}
              {isAvailable && activity.activityType === 'ONLINE' && (
                <AttendLinkDialog activityId={activity.id} />
              )}
              <Button asChild className="gap-2" size="sm">
                <Link href={`/activity/${activity.id}/edit`}>
                  <PencilIcon className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Edit</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </header>
      <section className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <Suspense fallback={<ActivityLoading />}>
          <PublicActivityCard id={id} />
        </Suspense>
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold">Participants</h1>
          <div className="my-2 flex gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Participants</p>
              <p className="text-2xl font-semibold">{attendance.length}</p>
            </div>
            {attendanceStats.map(({ campus, count }, index) => (
              <div key={index} className="border-l-2 pl-4">
                <p className="text-sm text-muted-foreground" style={{ color: campus.color }}>
                  {campus.name}
                </p>
                <p className="text-2xl font-semibold">{count}</p>
              </div>
            ))}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Attend DateTime</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((a, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Image
                        src={a.user.image ?? '/avatar.png'}
                        alt={a.user.name ?? 'User Avatar'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <p>
                        {a.user.profile?.firstName} {a.user.profile?.lastName}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{a.attendDateTime.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  )
}
