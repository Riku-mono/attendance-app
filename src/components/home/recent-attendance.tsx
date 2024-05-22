import Link from 'next/link'
import { CheckIcon, MapPinIcon, UserRoundCogIcon } from 'lucide-react'

export type Attendance = {
  id: string
  attendDateTime: Date
  activity: {
    name: string
    place: {
      name: string
    }
    owner: {
      profile: {
        firstName: string
        lastName: string
      }
    }
  }
}

export default function RecentAttendance({ attendance }: { attendance: Attendance[] }) {
  return (
    <div className="flex flex-col gap-2">
      {attendance.length === 0 && (
        <p className="w-full text-center text-muted-foreground">No attendance records found.</p>
      )}
      {attendance.map((a) => (
        <Link
          key={a.id}
          className="relative flex items-center gap-2 rounded-lg border p-3 text-left transition-all hover:bg-accent"
          href={`/attendance/${a.id}`}
        >
          <div className="flex flex-1 flex-col gap-2">
            <div className="font-semibold">{a.attendDateTime.toLocaleDateString()}</div>
            <div className="flex gap-1 text-xs text-muted-foreground">
              <span>{a.activity.name}</span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                {a.activity.place.name}
              </span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <UserRoundCogIcon className="h-4 w-4" />
                {a.activity.owner.profile.firstName} {a.activity.owner.profile.lastName}
              </span>
            </div>
          </div>
          <CheckIcon className="h-4 w-4 text-green-500" />
        </Link>
      ))}
    </div>
  )
}
