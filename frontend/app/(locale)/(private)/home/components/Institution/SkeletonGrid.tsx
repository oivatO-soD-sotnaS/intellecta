import { Skeleton } from "@heroui/skeleton"

export function SkeletonGrid() {
  return (
    <ul className="grid grid-cols-1 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="w-full">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="mt-2 h-3 w-1/5 rounded" />
              </div>
            </div>
            <Skeleton className="mt-4 h-36 w-full rounded-xl" />
          </div>
        </li>
      ))}
    </ul>
  )
}
