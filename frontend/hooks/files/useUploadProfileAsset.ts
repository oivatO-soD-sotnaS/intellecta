"use client";

import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { apiPost } from "@/lib/apiClient";
import type { ApiUploadedFile } from "@/types/file";

/**
 * Sobe uma imagem para ser usada como avatar ou banner.
 * O backend espera o arquivo em "profile-asset".
 */
async function uploadProfileAsset(file: File) {
  const fd = new FormData();
  fd.append("profile-asset", file, file.name); 
  const data = await apiPost<ApiUploadedFile>("/api/files/upload-profile-assets", fd);
  if (!data?.file_id) throw new Error("Resposta de upload inválida");
  return data;
}

export function useUploadProfileAsset() {
  return useMutation({
    mutationKey: ["upload", "profile-asset"],
    mutationFn: uploadProfileAsset,
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Falha ao enviar arquivo.";
      addToast({
        title: "Upload falhou",
        description: msg,
        color: "danger",
        variant: "flat",
      });
    },
  });
}
