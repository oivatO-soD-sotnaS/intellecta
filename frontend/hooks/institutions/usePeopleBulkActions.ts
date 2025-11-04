// hooks/institutions/usePeopleBulkActions.ts
"use client"

import { useChangeInstitutionUserRole } from "./useChangeInstitutionUserRole"
import { useRemoveInstitutionUser } from "./useRemoveInstitutionUser"

export function usePeopleBulkActions(institutionId: string) {
  const changeRole = useChangeInstitutionUserRole(institutionId)
  const removeUser = useRemoveInstitutionUser(institutionId)

  const bulkChangeRole = async (
    ids: string[],
    role: "admin" | "teacher" | "student"
  ) => {
    for (const id of ids) {
      // serial por simplicidade; pode trocar por Promise.all se o backend aguentar
      await changeRole.mutateAsync({ institution_user_id: id, role })
    }
  }

  const bulkRemove = async (ids: string[]) => {
    for (const id of ids) {
      await removeUser.mutateAsync(id)
    }
  }

  return { bulkChangeRole, bulkRemove, changeRole, removeUser }
}
