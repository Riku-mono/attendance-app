import { getActivity } from './action'
import Image from 'next/image'

import { InfoIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function PublicActivityCard({ id }: { id: string }) {
  const activity = await getActivity(id)
  if (!activity) {
    return null
  }
  return (
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
            <p className="whitespace-pre-wrap rounded-md border p-2">{activity.description}</p>
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
            <p className="rounded-md border p-2">{activity.place}</p>
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
  )
}
