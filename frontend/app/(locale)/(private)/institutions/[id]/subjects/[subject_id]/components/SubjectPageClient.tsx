"use client"

import { useMemo } from "react"
import SubjectHeader from "./SubjectHeader"
import SubjectTabs from "./SubjectTabs"
import { useSubject } from "@/hooks/subjects/useSubject"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import SubjectHeaderMock from "./mocks/SubjectHeader"
import { useInstitution } from "@/hooks/institution/useInstitution"

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
  const { data: institution } = useInstitution(institutionId)

  console.log("log do institution_id -> ", institutionId)

  const isTeacher = useMemo(() => {
    if (!currentUser) return false
    // MODO DEV: todo mundo logado pode gerenciar a disciplina
    return true
  }, [currentUser])

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
