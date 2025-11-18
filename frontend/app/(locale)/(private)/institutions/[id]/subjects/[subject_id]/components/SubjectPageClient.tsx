"use client"

import { useMemo } from "react"

import { useSubject } from "@/hooks/subjects/useSubject"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import SubjectHeader from "./SubjectHeader"
import SubjectTabs from "./SubjectTabs"

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

  const { data: currentUser } = useCurrentUser()

  // TODO: ajustar lógica real de role (talvez venha de useSubject ou outro hook)
  const isTeacher = useMemo(() => {
    // Exemplo bem genérico: se o usuário logado é o teacher da disciplina
    if (!subject || !currentUser) return false
    return subject.teacher?.user_id === currentUser.user_id
  }, [subject, currentUser])

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
        subject={subject}
        isLoading={isLoading}
      />

      <SubjectTabs
        institutionId={institutionId}
        subjectId={subjectId}
        subject={subject}
        isTeacher={isTeacher}
        isLoading={isLoading}
      />
    </div>
  )
}
