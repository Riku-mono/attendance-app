import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

import { NameSettingForm, userName } from './name-setting-form'
import { CampusSettingForm } from './campus-setting-form'
import UserProfileCard from './profile-card'

export default async function SettingsGeneralPage() {
  const session = await auth()
  if (!session) {
    return notFound()
  }

  const dbUser = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
    select: {
      campusId: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  })
  const userName = dbUser?.profile as userName
  const campusId = dbUser?.campusId as number
  const campus = await prisma.campus.findMany()
  if (!userName?.firstName || !userName?.lastName || !campusId) {
    return notFound()
  }

  return (
    <>
      <UserProfileCard user={session.user} />
      <NameSettingForm userName={userName} />
      <CampusSettingForm defaultCampusId={campusId} campusList={campus} />
    </>
  )
}
