import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import { checkToken, getValue } from '@/lib/token'
import getActivity from '@/app/api/activity/getActivity'
import getUserAttended from '@/app/api/user/getUserAttended'

import AlreadyAttended from '@/components/attendance/already-attended'
import AttendPage, { type Activity } from '@/components/attendance/attend-page'
import ErrorPage from '@/components/attendance/error'

export default async function AttendQRCodePage({ params }: { params: { token: string } }) {
  const { token } = params
  const activityId = (await checkToken(token)) ? await getValue(token) : null
  if (!activityId) {
    return <ErrorPage>This QR code is invalid.</ErrorPage>
  }

  const activity = await getActivity(activityId)
  if (!activity) {
    return notFound()
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

  const isUserAttended = await getUserAttended(user.id as string, activityId)
  console.log(isUserAttended)
  if (isUserAttended) {
    return <AlreadyAttended sequence={isUserAttended.sequenceByActivity} />
  }

  return <AttendPage activity={activity as Activity} user={user} />
}
