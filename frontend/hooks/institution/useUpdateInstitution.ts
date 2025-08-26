// hooks/institution/useUpdateInstitution.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPut } from "@/lib/apiClient";
import type { Institution, UpdateInstitutionInput, ApiInstitution } from "@/types/institution";
import { buildUpdateInstitutionFormData, mapApiInstitution } from "@/types/institution.mappers";

export function useUpdateInstitution(institutionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateInstitutionInput): Promise<Institution> => {
      const fd = buildUpdateInstitutionFormData(input);
      const updated = await apiPut<ApiInstitution>(`/api/institutions/${institutionId}`, fd);
      return mapApiInstitution(updated);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["institution", institutionId] });
      qc.invalidateQueries({ queryKey: ["institutions"] });
      qc.invalidateQueries({ queryKey: ["institution", institutionId, "summary"] });
    },
  });
}
