import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AlreadyAttended({ sequence }: { sequence: number }) {
  console.log(sequence)
  return (
    <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1">
      <div className="flex items-center justify-center py-12">
        <div className="w-128 mx-auto grid gap-6">
          <div>
            <h1 className="text-center text-2xl font-bold">Attend successfully!</h1>
            <p className="text-center text-lg text-muted-foreground">or</p>
            <h1 className="text-center text-2xl font-bold">Already attended this activity!</h1>
            <p className="mt-2 text-center text-lg text-muted-foreground">
              Your Attendance is the {sequence}th
            </p>
          </div>
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
