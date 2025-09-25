// hooks/auth/useCurrentUser.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/apiClient";

export type ApiUser = {
  user_id: string;
  full_name: string;
  email: string;
  profile_picture?: string; 
};

/**
 * Busca o usuário autenticado.
 */
const ME_ENDPOINT = "/api/me";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => apiGet<ApiUser>(ME_ENDPOINT),
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    retry: 1,
  });
}
