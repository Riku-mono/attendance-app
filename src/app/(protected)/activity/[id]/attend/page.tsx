import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import getActivity from '@/app/api/activity/getActivity'
import getUserAttended from '@/app/api/user/getUserAttended'

import AlreadyAttended from '@/components/attendance/already-attended'
import AttendPage, { type Activity } from '@/components/attendance/attend-page'
import ErrorPage from '@/components/attendance/error'

export default async function AttendURLPage({ params }: { params: { id: string } }) {
  const { id } = params
  const activity = await getActivity(id)
  if (!activity) {
    return notFound()
  }

  if (activity.activityType !== 'ONLINE') {
    return <ErrorPage>This activity does not allow attendance by this method.</ErrorPage>
  }

  const now = new Date()
  const isAvailable =
    now.getTime() >= (activity?.startDateTime?.getTime() ?? 0) - 10 * 60 * 1000 &&
    now.getTime() <= (activity?.endDateTime?.getTime() ?? 0)
  if (!isAvailable) {
    return <ErrorPage>This activity is out of reception hours.</ErrorPage>
  }

  const session = await auth()
  const user = session?.user
  if (!user) {
    return notFound()
  }

  const isTargetUser = activity.targets.map((target) => target.id).includes(user.campusId as number)
  if (!isTargetUser) {
    return <ErrorPage>You are not allowed to attend this activity.</ErrorPage>
  }

  const isUserAttended = await getUserAttended(user.id as string, id)
  if (isUserAttended) {
    return <AlreadyAttended sequence={isUserAttended.sequenceByActivity} />
  }

  return <AttendPage activity={activity as Activity} user={user} />
}
