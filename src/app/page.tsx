import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div
      className="container relative"
      style={{ backgroundImage: `url(/public/images/login.png)` }}
    >
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
          Welcome to Horizon Attendance App
        </h1>
        <span className="text-center text-lg font-light text-foreground">
          Please sign in to continue
        </span>
        <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
          <Button asChild>
            <Link href={'/auth/login'}>Join to App</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="https://github.com/Riku-mono/attendance-app" target="_blank" className="">
              GitHub Repository
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
