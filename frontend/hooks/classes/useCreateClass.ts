"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"

type CreateClassFormData = {
  name: string
  description: string
  profileFile?: File | null
  bannerFile?: File | null
  institutionId: string
}

async function createClassMultipart(input: CreateClassFormData) {
  const { name, description, profileFile, bannerFile, institutionId } = input

  const fd = new FormData()
  fd.append("name", name)
  fd.append("description", description)
  // nomes EXATOS que o backend espera:
  if (profileFile) fd.append("profile-picture", profileFile)
  if (bannerFile) fd.append("banner", bannerFile)

  // bate no proxy → backend createClass (multipart)
  return apiFetch(`/api/institutions/${institutionId}/classes`, {
    method: "POST",
    body: fd, // NÃO setar Content-Type manualmente
  })
}

export function useCreateClass(institutionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<CreateClassFormData, "institutionId">) =>
      createClassMultipart({ ...data, institutionId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classes", institutionId] })
    },
  })
}
