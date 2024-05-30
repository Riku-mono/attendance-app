import { createToken, setToken } from '@/lib/token'
import prisma from '@/lib/prisma'
import Link from 'next/link'

import { ChevronLeft } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'

import Generator from '@/components/qr-code/Generator'

export default async function QRCodeGeneratePage({ params }: { params: { id: string } }) {
  const activity = await prisma.activity.findUnique({
    where: { id: params.id },
  })
  if (!activity) {
    return <div>Activity not found</div>
  }
  const token = await createToken()
  const setTokenValue = await setToken(token, params?.id)

  return (
    <>
      <header className="mx-auto grid w-full max-w-7xl gap-4">
        <Breadcrumb className="flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/activity">Activities</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/activity/${params.id}`}>Activity</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>QR Code</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon" className="h-7 w-7">
              <Link href={`/activity/${params.id}`}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-semibold">QR Code</h1>
          </div>
        </div>
      </header>
      <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center gap-4">
        <p className="text-center text-sm">Scan the QR code below to attend to the activity.</p>
        <Generator content={token} activityId={params.id} />
      </section>
    </>
  )
}
