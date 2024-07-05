import Link from 'next/link'
import { PlusCircleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ActivityItem, type ActivityProps } from '@/components/activity/activity-item'

export default function RecentOwnedActivities({ activities }: { activities: ActivityProps[] }) {
  return (
    <div className="flex flex-col gap-2">
      {activities.length === 0 && (
        <div className="flex flex-col gap-4">
          <p className="w-full text-center text-muted-foreground">No activity records found.</p>
          <Button asChild variant="outline" className="mx-auto">
            <Link href="/activity/create" className="flex">
              <PlusCircleIcon className="mr-2 h-5 w-5" />
              Create activity
            </Link>
          </Button>
        </div>
      )}
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  )
}
