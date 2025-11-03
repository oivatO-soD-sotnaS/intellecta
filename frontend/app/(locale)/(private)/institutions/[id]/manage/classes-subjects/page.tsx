// app/(locale)/(private)/institutions/[id]/manage/classes-subjects/page.tsx
"use client"

import { use } from "react"
import ClassesSubjectsClient from "./components/classes/ClassesSubjectsClient"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <ClassesSubjectsClient institutionId={id} />
}
