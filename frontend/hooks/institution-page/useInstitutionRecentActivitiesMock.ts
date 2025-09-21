"use client"

import { activitiesMock } from "@/app/(locale)/(private)/institutions/[id]/dashboard/_mocks/activities.mock"

export function useInstitutionRecentActivitiesMock() {
  return { data: activitiesMock, isLoading: false, error: null as unknown }
}
