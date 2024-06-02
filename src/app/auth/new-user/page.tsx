import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

import { ProfileForm } from './new-user-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function NewUserPage() {
  const session = await auth()
  const campus = await prisma.campus.findMany()
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4 md:gap-8">
      <div>
        <h1 className="text-3xl font-semibold">Welcome to Attendance App, {session?.user.name}!</h1>
        <p className="text-lg text-muted-foreground">
          Please complete your profile to start using the app.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>GitHub Account</CardTitle>
          <CardDescription>
            Your GitHub account is used to identify you in the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Image
              src={session?.user.image || '/avatar-placeholder.png'}
              alt={session?.user.name + ' avatar'}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold">{session?.user.name}</h3>
              <p className="text-muted-foreground">{session?.user.email}</p>
            </div>
          </div>
          <br />
          <Button asChild variant="outline">
            <Link href="/auth/logout" className="btn btn-primary">
              Sign out
            </Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Please provide your first and last name, and select your campus. If you do not enter
            your real name, the administrator may change it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm campus={campus} />
        </CardContent>
      </Card>
    </div>
  )
}
