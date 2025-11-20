"use client"
import { useQuery } from "@tanstack/react-query"
import type {
  ApiInstitutionSummary,
  InstitutionSummary,
} from "@/types/institution"
import { mapApiInstitutionSummary } from "@/types/institution.mappers"

export function useInstitutionSummary(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: ["institution", id, "summary"],
    queryFn: async (): Promise<InstitutionSummary | null> => {
      const res = await fetch(`/api/institutions/summaries/${id}`, {
        credentials: "include",
      })
      if (res.status === 404) return null
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: ApiInstitutionSummary = await res.json()
      return mapApiInstitutionSummary(data)
    },
    retry: (failureCount, err: any) => {
      const is404 =
        typeof err?.message === "string" && err.message.includes("HTTP 404")
      return !is404 && failureCount < 1
    },
    staleTime: 60_000,
  })
}
