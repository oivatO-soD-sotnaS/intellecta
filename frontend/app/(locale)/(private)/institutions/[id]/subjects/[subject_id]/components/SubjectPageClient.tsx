"use client"

import { useMemo } from "react"
import SubjectHeader from "./SubjectHeader"
import SubjectTabs from "./SubjectTabs"
import { useSubject } from "@/hooks/subjects/useSubject"
import { useInstitution } from "../../../layout"


interface SubjectPageClientProps {
  institutionId: string
  subjectId: string
}

export default function SubjectPageClient({
  institutionId,
  subjectId,
}: SubjectPageClientProps) {
  const {
    data: subject,
    isLoading,
    error,
  } = useSubject(institutionId, subjectId)

  const { institution, me } = useInstitution()

  const userRole = me?.role


  const isTeacher = useMemo(() => {
    if (!userRole) return false

    // exemplo: teacher e admin podem gerenciar a disciplina
    return userRole === "teacher" || userRole === "admin"
  }, [userRole])

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-sm text-destructive">
          Ocorreu um erro ao carregar a disciplina.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <SubjectHeader
        institutionId={institutionId}
        institutionName={institution?.name}
        subject={subject}
        isLoading={isLoading}
        userRole={userRole}
        isTeacher={isTeacher}
      />

      <SubjectTabs
        institutionId={institutionId}
        subjectId={subjectId}
        subject={subject}
        isTeacher={isTeacher}
        isLoading={isLoading}
        userRole={userRole}
        currentUserId={me?.user_id}
      />
    </div>
  )
}
