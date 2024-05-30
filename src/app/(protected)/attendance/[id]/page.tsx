import { auth } from '@/auth'
import ActivityLoading from '@/components/activity/loading'
import PublicActivityCard from '@/components/activity/public-activity-card'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default async function AttendanceDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const session = await auth()
  const attendance = await prisma.attendance.findFirst({
    where: { id: id },
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
      activityId: true,
      attendDateTime: true,
      sequenceByActivity: true,
    },
    orderBy: { attendDateTime: 'desc' },
  })
  if (!attendance) {
    return notFound()
  }

  const activity = await prisma.activity.findUnique({
    where: { id: attendance.activityId },
    select: {
      startDateTime: true,
      endDateTime: true,
    },
  })

  const { startDateTime, endDateTime } = activity || {}
  const { attendDateTime } = attendance
  if (!startDateTime || !endDateTime || !attendDateTime) {
    return notFound()
  }
  const duration = endDateTime.getTime() - startDateTime.getTime()
  const attendPercent = ((attendDateTime.getTime() - startDateTime.getTime()) / duration) * 100

  return (
    <>
      <header className="mx-auto grid w-full max-w-7xl gap-4">
        <Breadcrumb className="flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/attendance">Attendance</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Attend Log</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon" className="h-7 w-7">
              <Link href="/attendance">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-semibold">Attend Log</h1>
          </div>
        </div>
      </header>
      <section className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="w-full border-b pb-2 text-center text-muted-foreground">
              Your Attendance
            </p>
            <h2 className="text-2xl font-semibold">
              {attendance?.attendDateTime.toLocaleString()}
            </h2>
            <p className="text-xl font-semibold">{attendance?.sequenceByActivity}th</p>
          </div>
          {/* timeline graph */}
          <div className="mt-4 flex flex-col gap-2">
            <div className="relative flex h-6 w-full items-center p-2">
              <div className="relative h-2 w-full overflow-hidden rounded-full border bg-background">
                <div className="absolute h-2 bg-primary" style={{ width: `${attendPercent}%` }} />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute -left-1 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border bg-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{startDateTime?.toLocaleString()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border bg-foreground"
                      style={{ left: `${attendPercent}%` }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{attendDateTime?.toLocaleString()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute -right-1 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border bg-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{endDateTime?.toLocaleString()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative h-6 w-full">
              <p className="absolute -left-1 top-0 text-muted-foreground">Start</p>
              <p
                className="absolute -top-14 -translate-x-1/3 text-muted-foreground"
                style={{ left: `${attendPercent}%` }}
              >
                Attend
              </p>
              <p className="absolute -right-1 top-0 text-muted-foreground">End</p>
            </div>
          </div>
        </div>
        <Suspense fallback={<ActivityLoading />}>
          <PublicActivityCard id={attendance.activityId} />
        </Suspense>
      </section>
    </>
  )
}
