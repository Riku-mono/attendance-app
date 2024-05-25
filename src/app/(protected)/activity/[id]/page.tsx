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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, InfoIcon, PencilIcon, QrCodeIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AttendLinkDialog from '@/components/attend-link-dialog'

export default async function ActivityDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const session = await auth()
  const activity = await prisma.activity.findUnique({
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
      place: {
        select: { id: true, name: true },
      },
      startDateTime: true,
      endDateTime: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  if (!activity) {
    return notFound()
  }

  const isOwner = session?.user?.id === activity?.owner.id

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

  // attendance.user.campusId ごとの出席数を計算
  const targetAttendance = attendance.reduce(
    (acc, cur) => {
      const target = activity.targets.find((target) => target.id === cur.user?.campusId)
      if (!target) {
        return acc
      }
      acc[target.id] = acc[target.id] ? acc[target.id] + 1 : 1
      return acc
    },
    {} as Record<string, number>
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
              {isAvailable && activity.activityType === 'offline' && (
                <Button asChild variant="outline" className="gap-2" size="sm">
                  <Link href={`/activity/${activity.id}/qr-code`}>
                    <QrCodeIcon className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Generate Attend QR Code
                    </span>
                  </Link>
                </Button>
              )}
              {isAvailable && activity.activityType === 'online' && (
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
        <Card className="mb-auto">
          <CardHeader>
            <CardDescription>Title</CardDescription>
            <CardTitle>{activity.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Owner</p>
                <div className="flex items-center gap-2 rounded-md border p-2">
                  <Image
                    src={activity.owner.image ?? '/avatar.png'}
                    alt={activity.owner.name ?? 'User Avatar'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <p>
                    {activity.owner.profile?.firstName} {activity.owner.profile?.lastName}
                  </p>
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Description</p>
                <p className="rounded-md border p-2">{activity.description}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Term</p>
                <p className="rounded-md border p-2">
                  <span>{activity.startDateTime?.toLocaleString()}</span>
                  <span> - </span>
                  {activity.startDateTime?.toLocaleDateString() !==
                  activity.endDateTime?.toLocaleDateString() ? (
                    <span>{activity.endDateTime?.toLocaleString()}</span>
                  ) : (
                    <span>{activity.endDateTime?.toLocaleTimeString()}</span>
                  )}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Targets</p>
                <div className="gap-2 rounded-md border p-2">
                  {activity.targets?.map((target, index) => (
                    <Badge key={index} variant="outline" className="mr-1">
                      {target.name}
                      <span
                        style={{ backgroundColor: target.color }}
                        className="ml-1 inline-block h-2 w-2 rounded-full"
                      />
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <span>Activity Type</span>
                  <Dialog>
                    <DialogTrigger>
                      <InfoIcon className="h-4 w-4 transition hover:text-primary" />
                      <span className="sr-only">Information about Activity Type</span>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <InfoIcon className="h-4 w-4" />
                          Activity Type
                        </DialogTitle>
                        <DialogDescription>
                          Information on whether the activity format is online or offline.
                          <br />
                          The method of attendance differs.
                          <br />
                          If online, it is a fixed URL.
                          <br />
                          If offline, it is a QR code with a time limit.
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="rounded-md border p-2">
                  <Badge variant="outline" className="mr-auto">
                    {activity.activityType}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Location</p>
                <p className="rounded-md border p-2">{activity.place?.name}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Created At</p>
                <p className="rounded-md border p-2">{activity.createdAt.toLocaleString()}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Updated At</p>
                <p className="rounded-md border p-2">{activity.updatedAt.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold">Participants</h1>
          <div className="my-2 flex gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Participants</p>
              <p className="text-2xl font-semibold">{attendance.length}</p>
            </div>
            {activity.targets.map((target, index) => (
              <div key={index} className="border-l-2 pl-4">
                <p className="text-sm text-muted-foreground" style={{ color: target.color }}>
                  {target.name}
                </p>
                <p className="text-2xl font-semibold">{targetAttendance[target.id] ?? 0}</p>
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
