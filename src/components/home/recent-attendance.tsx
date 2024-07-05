import { AttendanceItem, type AttendanceProps } from '@/components/attendance/attendance-item'

export default function RecentAttendance({ attendance }: { attendance: AttendanceProps[] }) {
  return (
    <div className="flex flex-col gap-2">
      {attendance.length === 0 && (
        <p className="w-full text-center text-muted-foreground">No attendance records found.</p>
      )}
      {attendance.map((a) => (
        <AttendanceItem key={a.id} attendance={a} />
      ))}
    </div>
  )
}
