// app/(locale)/(private)/institutions/[id]/manage/institution/components/Skeletons.tsx
"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function HeaderSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <Skeleton className="h-48 w-full" />
      <div className="flex items-end gap-4 px-6 -mt-10 pb-4">
        <Skeleton className="size-20 rounded-full ring-4 ring-background" />
        <div className="flex-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-2 h-4 w-56" />
        </div>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border p-4">
      <Skeleton className="h-5 w-40 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}
