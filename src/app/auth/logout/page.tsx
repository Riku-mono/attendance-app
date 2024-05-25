import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signOut } from '@/auth'

export default function LogoutPage() {
  return (
    <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign out</h1>
            <p className="text-balance text-muted-foreground">Are you sure you want to sign out?</p>
          </div>
          <div className="grid gap-4">
            <form
              action={async () => {
                'use server'
                await signOut()
              }}
              className="space-y-8"
            >
              <Button type="submit" className="w-full">
                Sign out
              </Button>
            </form>
            <Button asChild variant="outline">
              <Link href="/">Cancel</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
