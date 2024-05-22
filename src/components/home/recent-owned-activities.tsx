import Link from 'next/link'
import { MapPinIcon, PlusCircleIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export type Activity = {
  id: string
  name: string
  activityType: string
  place: {
    name: string
  }
  startDateTime: Date
  endDateTime: Date
}

export default function RecentOwnedActivities({ activities }: { activities: Activity[] }) {
  return (
    <div className="flex flex-col gap-2">
      {activities.length === 0 && (
        <div className="flex flex-col gap-4">
          <p className="w-full text-center text-muted-foreground">No activity records found.</p>
          <Button variant="outline" className="mx-auto">
            <Link href="/activity/create" className="flex">
              <PlusCircleIcon className="mr-2 h-5 w-5" />
              Create activity
            </Link>
          </Button>
        </div>
      )}
      {activities.map((activity) => (
        <Link
          key={activity.id}
          className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-all hover:bg-accent"
          href={`/activity/${activity.id}`}
        >
          <div className="flex flex-row items-center gap-2">
            <div className="font-semibold">{activity.name}</div>
            <Badge variant="outline">{activity.activityType}</Badge>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium">
            <MapPinIcon className="h-4 w-4" />
            {activity.place?.name}
          </div>
          <div className="flex flex-wrap items-center gap-1 text-xs font-medium text-muted-foreground">
            <span>
              {activity.startDateTime?.toLocaleDateString()}{' '}
              {activity.startDateTime?.toLocaleTimeString()}
            </span>
            {(activity.startDateTime?.toLocaleDateString() !==
              activity.endDateTime?.toLocaleDateString() && (
              <>
                <span>|</span>
                <span>
                  {activity.endDateTime?.toLocaleDateString()}{' '}
                  {activity.endDateTime?.toLocaleTimeString()}
                </span>
              </>
            )) || (
              <>
                <span>-</span>
                <span>{activity.endDateTime?.toLocaleTimeString()}</span>
              </>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
