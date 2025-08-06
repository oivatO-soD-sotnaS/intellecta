"use client"

import { useInstitutionSubjects } from "@/hooks/institution/useInstitutionSubjects"
import CourseCard from "./CourseCard"
import { Spinner } from "@heroui/spinner"
import { Alert } from "@heroui/alert"

interface CoursesListProps {
  institutionId: string
}

export default function CoursesList({ institutionId }: CoursesListProps) {
  const { data, isLoading, error } = useInstitutionSubjects(institutionId)

  if (isLoading) return <Spinner className="m-auto" />
  if (error) return <Alert title="error" description={error.message} />

  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Nenhuma disciplina encontrada.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((sub) => (
        <CourseCard key={sub.subjectId} subject={sub} />
      ))}
    </div>
  )
}
