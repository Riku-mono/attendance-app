import { auth } from '@/auth'
import RecentOwnedActivities from '@/components/home/recent-owned-activities'
import { getOwnedActivities } from './action'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default async function OwnedActivitiesPage() {
  const session = await auth()

  const ownedactivities = await getOwnedActivities({ userId: session?.user.id as string })

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4">
      <h1 className="text-3xl font-semibold">Your Owned Activities</h1>
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Showing {ownedactivities.length} your activities</h3>
        </CardHeader>
        <CardContent>
          <RecentOwnedActivities activities={ownedactivities} />
        </CardContent>
      </Card>
    </div>
  )
}
