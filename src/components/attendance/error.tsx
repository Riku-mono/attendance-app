import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ErrorPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-96 gap-6">
          <h1 className="text-center text-2xl font-bold">{children}</h1>
          <div className="grid gap-2">
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
