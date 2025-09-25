// hooks/useInstitutionSubjects.mock.ts]

import { useMemo, useState, useEffect } from "react";
import { SubjectDTO } from "@/types/subject";
import { subjectsMock } from "@/app/(locale)/(private)/institutions/[id]/dashboard/_mocks/courses.mock";

// Simula latência leve e estados de loading/erro.
// Depois é só trocar o corpo do useEffect por um fetch/React Query.
export function useInstitutionSubjectsMock(institutionId?: string) {
  const [data, setData] = useState<SubjectDTO[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);

    const t = setTimeout(() => {
      if (cancelled) return;
      // Filtra por instituição, caso queira simular múltiplas
      setData(subjectsMock.filter(s => !institutionId || s.institution_id === institutionId));
      setIsLoading(false);
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [institutionId]);

  return useMemo(
    () => ({ data, isLoading, isError }),
    [data, isLoading, isError]
  );
}
