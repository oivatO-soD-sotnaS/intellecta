// hooks/institution/useCreateInstitution.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/apiClient";
import type { Institution, CreateInstitutionInput, ApiInstitution } from "@/types/institution";
import { buildCreateInstitutionFormData, mapApiInstitution } from "@/types/institution.mappers";

export function useCreateInstitution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateInstitutionInput): Promise<Institution> => {
      const fd = buildCreateInstitutionFormData(input);
      const created = await apiPost<ApiInstitution>("/api/institutions", fd);
      return mapApiInstitution(created);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["institutions"] });
    },
  });
}
