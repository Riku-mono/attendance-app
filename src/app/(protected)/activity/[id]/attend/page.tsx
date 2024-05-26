import getActivity from '@/app/api/activity/getActivity'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/auth'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import getUserAttended from '@/app/api/user/getUserAttended'
import { AttendForm } from './attend-form'

export default async function AttendPage({ params }: { params: { id: string } }) {
  const { id } = params
  const activity = await getActivity(id)
  if (!activity) {
    return notFound()
  }

  const now = new Date()
  const isAvailable =
    now.getTime() >= (activity?.startDateTime?.getTime() ?? 0) - 10 * 60 * 1000 &&
    now.getTime() <= (activity?.endDateTime?.getTime() ?? 0) &&
    activity.activityType === 'online'

  if (!isAvailable) {
    return (
      <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1">
        <div className="flex items-center justify-center py-12">
          <div className="w-128 mx-auto grid gap-6">
            <h1 className="text-center text-2xl font-bold">
              This activity is not available for attendance
            </h1>
            <div className="grid gap-2">
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const session = await auth()
  if (!session) {
    return notFound()
  }
  const isUserAttended = await getUserAttended(session.user.id as string, id)

  if (isUserAttended) {
    return (
      <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1">
        <div className="flex items-center justify-center py-12">
          <div className="w-128 mx-auto grid gap-6">
            <div>
              <h1 className="text-center text-4xl font-bold">Attend successfully!</h1>
              <div className="text-center">Thank you for your participation!</div>
            </div>
            <div className="grid gap-2">
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-96 gap-6">
          <Card>
            <CardHeader>
              <CardDescription>Title</CardDescription>
              <CardTitle>{activity.name || 'Undefined'}</CardTitle>
              <CardDescription>Owned by {activity.owner?.name || 'Undefined'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
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
                  <p className="mb-1 text-sm text-muted-foreground">Location</p>
                  <p className="rounded-md border p-2">{activity.place?.name}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Account</p>
                <div className="flex gap-2">
                  <Image
                    src={session.user.image || '/default-avatar.png'}
                    alt={session.user.name || 'User'}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span>{session.user.name || 'User'}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
          <div className="grid gap-2">
            <AttendForm userAttendProps={{ userId: session.user.id as string, activityId: id }} />
            <Button asChild variant="outline">
              <Link href="/">Cancel</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
