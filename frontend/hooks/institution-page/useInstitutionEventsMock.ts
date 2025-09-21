"use client"

import { eventsMock } from "@/app/(locale)/(private)/institutions/[id]/dashboard/_mocks/events.mock"

export function useInstitutionEventsMock() {
  return { data: eventsMock, isLoading: false, error: null as unknown }
}
