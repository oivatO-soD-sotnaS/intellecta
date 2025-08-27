// hooks/institution/useUpdateInstitution.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { apiPut } from "@/lib/apiClient";
import type { UpdateInstitutionInput } from "@/types/institution";
import { buildUpdateInstitutionPayload } from "@/types/institution.mappers";

export function useUpdateInstitution(institutionId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["institutions", "update", institutionId],
    mutationFn: async (data: UpdateInstitutionInput) => {
      const body = buildUpdateInstitutionPayload(data);
      await apiPut(`/api/institutions/${institutionId}`, body);
    },
    onSuccess: async () => {
      await Promise.allSettled([
        qc.invalidateQueries({ queryKey: ["institutions"] }),
        qc.invalidateQueries({ queryKey: ["institutions", "owned"] }),
        qc.invalidateQueries({ queryKey: ["institution", institutionId] }),
        qc.invalidateQueries({ queryKey: ["institution", institutionId, "summary"] }),
      ]);
      addToast({
        title: "Instituição atualizada",
        description: "Alterações salvas com sucesso.",
        color: "success",
        variant: "flat",
      });
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Não foi possível atualizar a instituição.";
      addToast({
        title: "Erro ao atualizar",
        description: msg,
        color: "danger",
        variant: "flat",
      });
    },
  });
}
