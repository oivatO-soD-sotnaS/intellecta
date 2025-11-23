// app/(locale)/(private)/institutions/[institution_id]/subjects/[subject_id]/forum/_components/ForumSkeletonList.tsx

import { Skeleton } from "@/components/ui/skeleton"

export function ForumSkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 rounded-lg border bg-card/80 p-4"
        >
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      ))}
    </div>
  )
}
