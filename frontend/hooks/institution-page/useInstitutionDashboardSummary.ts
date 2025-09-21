"use client"

import { summaryMock } from "@/app/(locale)/(private)/institutions/[id]/dashboard/_mocks/summary.mock"


export function useInstitutionDashboardSummary() {
  // Interface semelhante a react-query para trocar depois:
  return {
    data: summaryMock,
    isLoading: false,
    error: null as unknown,
  }
}
