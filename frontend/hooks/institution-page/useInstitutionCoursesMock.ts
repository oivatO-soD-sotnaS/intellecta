// useInstitutionCoursesMock.ts
// Mantive o nome do arquivo para não quebrar imports,
// mas agora ele retorna CLASSES (não mais subjects).

import { classesMock } from "@/app/(locale)/(private)/institutions/[id]/dashboard/_mocks/courses.mock"
import { ClassDTO } from "@/types/subject"



type UseInstitutionClassesResult = {
  data: ClassDTO[]
  isLoading: boolean
  isError: boolean
}

export function useInstitutionCoursesMock(
  _: string | undefined = undefined
): UseInstitutionClassesResult {
  return {
    data: classesMock, // sempre retorna o mock completo
    isLoading: false, // sem loading em design review
    isError: false, // sem erros no mock
  }
}
