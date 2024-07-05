import Link from 'next/link'
import { CheckIcon, MapPinIcon, UserRoundCogIcon } from 'lucide-react'

export type AttendanceProps = {
  id: string
  attendDateTime: Date
  activity: {
    id: string
    name: string
    place: string
    owner: {
      profile: {
        firstName: string
        lastName: string
      }
    }
  }
}

export async function AttendanceItem({ attendance }: { attendance: AttendanceProps }) {
  return (
    <Link
      key={attendance.id}
      className="relative flex items-center gap-2 rounded-lg border p-3 text-left transition-all hover:bg-accent"
      href={`/attendance/${attendance.id}`}
    >
      <div className="flex flex-1 flex-col gap-2">
        <div className="font-semibold">{attendance.attendDateTime.toLocaleString()}</div>
        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
          <span>{attendance.activity.name}</span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4" />
            {attendance.activity.place}
          </span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <UserRoundCogIcon className="h-4 w-4" />
            {attendance.activity.owner.profile.firstName}{' '}
            {attendance.activity.owner.profile.lastName}
          </span>
        </div>
      </div>
      <CheckIcon className="h-4 w-4 text-green-500" />
    </Link>
  )
}
