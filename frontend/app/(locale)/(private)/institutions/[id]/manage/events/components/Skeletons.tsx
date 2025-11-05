// app/(locale)/(private)/institutions/[id]/manage/events/_components/Skeletons.tsx
"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonToolbar() {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="flex flex-1 items-center gap-2">
        <Skeleton className="h-10 w-full md:w-80" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  )
}

export function SkeletonCalendar() {
  return <Skeleton className="h-[600px] w-full rounded-xl" />
}
