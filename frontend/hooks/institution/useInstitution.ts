"use client";
import { useQuery } from "@tanstack/react-query";

type Options = { enabled?: boolean };

export function useInstitution(id?: string, options?: Options) {
  const enabled = !!id && (options?.enabled ?? true);

  return useQuery({
    enabled,
    queryKey: ["institution", id],
    queryFn: async () => {
      const res = await fetch(`/api/institutions/${id}`, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 404) {
          const e = new Error("NOT_FOUND");
          (e as any).status = 404;
          throw e;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json();
    },
    retry: (failureCount, err: any) => {
      // não re-tentar 404; demais erros no máx 1 retry
      return err?.status === 404 ? false : failureCount < 1;
    },
    staleTime: 60_000,
  });
}
