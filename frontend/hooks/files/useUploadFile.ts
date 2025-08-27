"use client";

import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { apiPost } from "@/lib/apiClient";
import type { ApiUploadedFile } from "@/types/file";

async function uploadGeneric(file: File) {
  const fd = new FormData();
  fd.append("files", file);
  const data = await apiPost<ApiUploadedFile>("/api/files/upload-file", fd);
  if (!data?.file_id) throw new Error("Resposta de upload inválida");
  return data;
}

export function useUploadFile() {
  return useMutation({
    mutationKey: ["upload", "file"],
    mutationFn: uploadGeneric,
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Falha ao enviar arquivo.";
      addToast({ title: "Upload falhou", description: msg, color: "danger", variant: "flat" });
    },
  });
}
