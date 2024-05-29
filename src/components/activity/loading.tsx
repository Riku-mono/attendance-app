import { Skeleton } from '@/components/ui/skeleton'

export default function ActivityLoading() {
  return (
    <div className="mb-auto rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <p className="text-sm text-muted-foreground">Title</p>
        <Skeleton className="h-6 w-3/4 rounded-md" />
      </div>
      <div className="p-6 pt-0">
        <div className="grid gap-2">
          <div>
            <p className="mb-1 text-sm text-muted-foreground">Owner</p>
            <div className="flex items-center gap-2 rounded-md border p-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm text-muted-foreground">Description</p>
            <Skeleton className="h-10 rounded-md" />
          </div>
          <div>
            <p className="mb-1 text-sm text-muted-foreground">Term</p>
            <Skeleton className="h-10 rounded-md" />
          </div>
          <div>
            <p className="mb-1 text-sm text-muted-foreground">Targets</p>
            <Skeleton className="h-10 rounded-md" />
          </div>
          <div>
            <p className="mb-1 text-sm text-muted-foreground">Activity Type</p>
            <Skeleton className="h-10 rounded-md" />
          </div>
          <div>
            <p className="mb-1 text-sm text-muted-foreground">Location</p>
            <Skeleton className="h-10 rounded-md" />
          </div>
          <div>
            <p className="mb-1 text-sm text-muted-foreground">Created At</p>
            <Skeleton className="h-10 rounded-md" />
          </div>
          <div>
            <p className="mb-1 text-sm text-muted-foreground">Updated At</p>
            <Skeleton className="h-10 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
