"use client"

import { coursesMock } from "@/app/(locale)/(private)/institutions/[id]/dashboard/_mocks/courses.mock"

export function useInstitutionCoursesMock() {
  return { data: coursesMock, isLoading: false, error: null as unknown }
}
