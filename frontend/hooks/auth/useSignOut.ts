// hooks/auth/useSignOut.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

async function signOutRequest() {
  const res = await fetch("/api/sign-out", {
    method: "POST",
    cache: "no-store",
  });

  if (!res.ok && res.status !== 401) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Falha ao sair (${res.status})`);
  }
  return res.json().catch(() => ({}));
}

export function useSignOut() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: signOutRequest,
    onSuccess: () => {
      qc.clear();

      try {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("profile-storage")
        localStorage.removeItem("tc_token_validated")
      } catch {}

      router.replace("/sign-in");
      router.refresh();
    },
  });
}
