import Link from 'next/link'
import { auth } from '@/auth'
import NextActivitiesCarousel from '@/components/home/next-activites-carousel'
import RecentAttendance from '@/components/home/recent-attendance'
import RecentOwnedActivities from '@/components/home/recent-owned-activities'
import { getNextActivities, getRecentAttendance, getRecentOwnedActivities } from './action'

import { ArrowUpRight, PlusCircleIcon, ScanLineIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function home() {
  const session = await auth()
  const nextActivities = await getNextActivities({ userCampusId: session?.user.campusId as number })
  const recentAttendance = await getRecentAttendance({ userId: session?.user.id as string })
  const recentOwnedActivities = await getRecentOwnedActivities({
    userId: session?.user.id as string,
  })

  return (
    <>
      <div className="mx-auto grid w-full max-w-7xl gap-4">
        <h1 className="text-3xl font-semibold">Home</h1>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          <NextActivitiesCarousel activities={nextActivities} />
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Button asChild>
                <Link href="/qr-reader" className="flex">
                  <ScanLineIcon className="mr-2 h-5 w-5" />
                  Scan QR Code
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/activity/create" className="flex">
                  <PlusCircleIcon className="mr-2 h-5 w-5" />
                  Create Activity
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* Recent Attendance */}
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Attendance</CardTitle>
              <CardDescription>Three most recent attendance records.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="mb-2 font-semibold">Recent Attendance</h3>
            <RecentAttendance attendance={recentAttendance} />
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full gap-1" variant="secondary">
              <Link href="/attendance">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        {/* Owned activitys */}
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Owned Activities</CardTitle>
              <CardDescription>Three most recent activities that you have edited.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="mb-2 font-semibold">Recent Activities</h3>
            <RecentOwnedActivities activities={recentOwnedActivities} />
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full gap-1" variant="secondary">
              <Link href="/attendance">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
