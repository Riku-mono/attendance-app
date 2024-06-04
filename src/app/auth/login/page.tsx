import Image from 'next/image'
import Link from 'next/link'
import { signIn } from '@/auth'
import { providerMap } from '@/auth.config'
import { Button } from '@/components/ui/button'

export default async function SignInPage() {
  return (
    <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign in</h1>
            <p className="text-balance text-muted-foreground">Please sign in to continue</p>
          </div>
          <div className="grid gap-4">
            {Object.values(providerMap).map((provider) => (
              <form
                action={async () => {
                  'use server'
                  await signIn(provider.id)
                }}
                className="space-y-8"
                key={provider.id}
              >
                <Button type="submit" className="w-full">
                  Sign in with {provider.name}
                </Button>
              </form>
            ))}
          </div>
          <Button asChild variant="outline">
            <Link href="/">Cancel</Link>
          </Button>
          <div className="mt-4 text-center text-sm">
            <p>Only acsess {process.env.PUBLIC_GITHUB_ORG} Members</p>
          </div>
        </div>
      </div>
      <div className="hidden max-h-[calc(100vh_-_theme(spacing.36))] overflow-visible lg:flex">
        <Image
          src="/images/login.png"
          alt="Image"
          width="1080"
          height="1080"
          className="my-auto max-w-full object-cover dark:brightness-[0.7]"
        />
      </div>
    </div>
  )
}
