"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPut } from "@/lib/apiClient";

type Payload = { role: string };
type Resp = unknown;

export function useChangeUserRole(institutionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      apiPut<Resp>(`/api/institutions/${institutionId}/users/${userId}/role`, { role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["institution", institutionId, "users"] });
    },
  });
}
