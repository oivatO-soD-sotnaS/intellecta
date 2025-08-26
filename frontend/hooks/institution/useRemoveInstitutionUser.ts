"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiDelete } from "@/lib/apiClient";

export function useRemoveInstitutionUser(institutionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      apiDelete<unknown>(`/api/institutions/${institutionId}/users/${userId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["institution", institutionId, "users"] });
    },
  });
}
