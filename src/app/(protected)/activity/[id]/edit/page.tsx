import { auth } from '@/auth'
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
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { ActivityEditForm } from '@/components/activity/edit/activity-edit-form'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import getActivity from '@/app/api/activity/getActivity'

export default async function ActivityDetailEditPage({ params }: { params: { id: string } }) {
  const { id } = params
  const session = await auth()
  const activity = await getActivity(id)
  if (!activity) {
    return notFound()
  }

  const isOwner = session?.user?.id === activity?.owner.id
  if (!isOwner) {
    return notFound()
  }

  const isAdmin = session?.user?.role === 'ADMIN'
  const campuses = await prisma.campus.findMany()
  console.log(activity)
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4 md:gap-8">
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
              <BreadcrumbPage>Edit</BreadcrumbPage>
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
            <h1 className="text-3xl font-semibold">Edit Activity</h1>
          </div>
        </div>
      </header>
      <Card>
        <CardHeader>
          <CardDescription>Edit a activity</CardDescription>
          <CardTitle>Activity Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityEditForm isAdmin={isAdmin} campus={campuses} activity={activity} />
        </CardContent>
      </Card>
    </div>
  )
}
