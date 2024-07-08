import { auth } from '@/auth'
import RecentAttendance from '@/components/home/recent-attendance'
import { getAttendance } from './action'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default async function AttendancePage() {
  const session = await auth()

  const attendance = await getAttendance({ userId: session?.user.id as string })

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4">
      <h1 className="text-3xl font-semibold">Attendance</h1>
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Showing {attendance.length} Attendance Logs</h3>
        </CardHeader>
        <CardContent>
          <RecentAttendance attendance={attendance} />
        </CardContent>
      </Card>
    </div>
  )
}
