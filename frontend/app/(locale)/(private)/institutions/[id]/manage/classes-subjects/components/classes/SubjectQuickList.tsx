// app/(locale)/(private)/institutions/[id]/manage/classes-subjects/components/SubjectQuickList.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
import { Skeleton } from "@/components/ui/skeleton"

type SubjectLite = {
  subject_id: string
  name: string
}

export default function SubjectQuickList({
  institutionId,
  classId,
}: {
  institutionId: string
  classId: string
}) {
  const q = useQuery({
    enabled: Boolean(institutionId && classId),
    queryKey: ["class-subjects-quick", institutionId, classId],
    queryFn: () =>
      apiGet<{ class_subjects_id: string; subject: SubjectLite }[]>(
        `/api/institutions/${institutionId}/classes/${classId}/subjects`
      ),
  })

  if (q.isLoading) return <Skeleton className="h-6 w-24" />
  if (!q.data?.length)
    return <span className="text-sm text-muted-foreground">0 disciplinas</span>

  return (
    <span className="text-sm text-muted-foreground">
      {q.data.length} disciplina{q.data.length === 1 ? "" : "s"}
    </span>
  )
}
