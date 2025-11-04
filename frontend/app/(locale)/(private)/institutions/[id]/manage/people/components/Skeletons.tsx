// app/(locale)/(private)/institutions/[id]/manage/people/_components/Skeletons.tsx
"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PeopleHeaderSkeleton() {
  return (
    <Card className="p-4 md:p-5 flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-36" />
      </div>
    </Card>
  )
}

export function PeopleTableSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-3">
                  <Skeleton className="h-5 w-5" />
                </td>
                <td className="px-3 py-3">
                  <Skeleton className="h-5 w-64" />
                </td>
                <td className="px-3 py-3">
                  <Skeleton className="h-5 w-56" />
                </td>
                <td className="px-3 py-3">
                  <Skeleton className="h-9 w-40" />
                </td>
                <td className="px-3 py-3 text-right">
                  <Skeleton className="h-9 w-24 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
