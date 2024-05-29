import { User } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'

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
import { AttendForm } from '@/components/attendance/attend-form'

interface AttendPageProps {
  activity: Activity
  user: User
}

export type Activity = {
  id: string
  name: string
  owner: {
    id: string
    name: string
  }
  activityType: string
  targets: Target[]
  place: {
    id: number
    name: string
  }
  startDateTime: Date
  endDateTime: Date
}

type Target = {
  id: number
  name: string
  color: string
}

export default async function AttendPage({ activity, user }: AttendPageProps) {
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
                    src={user.image || '/default-avatar.png'}
                    alt={user.name || 'User'}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span>{user.name || 'User'}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
          <div className="grid gap-2">
            <AttendForm userAttendProps={{ userId: user.id as string, activityId: activity.id }} />
            <Button asChild variant="outline">
              <Link href="/">Cancel</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
