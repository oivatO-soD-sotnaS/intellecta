"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/apiClient";

type InvitePayload = {
  emails: string[];      
  role?: string;
};

type InviteResponse = { invited: number; failed?: string[] } | unknown;

export function useInviteUsers(institutionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InvitePayload) =>
      apiPost<InviteResponse>(`/api/institutions/${institutionId}/invites`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["institution", institutionId, "users"] });
    },
  });
}
