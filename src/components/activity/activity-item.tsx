import Link from 'next/link'
import { MapPinIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export type ActivityProps = {
  id: string
  name: string
  activityType: string
  place: string
  startDateTime: Date
  endDateTime: Date
}

export async function ActivityItem({ activity }: { activity: ActivityProps }) {
  return (
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
        {activity.place}
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
  )
}
