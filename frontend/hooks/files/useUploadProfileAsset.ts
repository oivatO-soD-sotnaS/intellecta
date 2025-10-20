"use client"

import { useMutation } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"

export type UploadProfileAssetResponse = {
  file_id: string
  url?: string
  filename?: string
  mime_type?: string
  size?: number
  uploaded_at?: string
}

/**
 * Sobe um arquivo de imagem para o endpoint de assets de perfil.
 * IMPORTANTE: o backend espera o campo multipart com o nome "profile-asset".
 */
async function uploadProfileAsset(
  file: File
): Promise<UploadProfileAssetResponse> {
  const fd = new FormData()
  fd.append("profile-asset", file)

  return apiFetch<UploadProfileAssetResponse>(
    "/api/files/upload-profile-assets",
    {
      method: "POST",
      body: fd, 
    }
  )
}

export function useUploadProfileAsset() {
  return useMutation({
    mutationFn: uploadProfileAsset, 
  })
}
