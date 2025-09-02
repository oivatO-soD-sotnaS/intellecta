/* eslint-disable @typescript-eslint/no-unused-vars */
// app/(locale)/(private)/profile/hooks/useProfileForm.ts
"use client"

import React from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { addToast } from "@heroui/toast"
import { useUser } from "./useUser"
import { useProfileStore } from "@/store/profileStore"
import { apiPost, apiPut } from "@/lib/apiClient"

// === Tipagens ===
interface User {
  user_id: string
  full_name: string
  profile_picture_id?: string
  profile_picture_url?: string
}

interface FileUploadResponse {
  file_id: string
  url?: string
}

export function useProfileForm() {
  const qc = useQueryClient()
  const { data: user, isLoading, isError } = useUser()

  // Zustand persist
  const {
    fullName: storedName,
    profilePictureId: storedPictureId,
    profilePictureUrl: storedPictureUrl,
    setProfile,
  } = useProfileStore()

  // local form state
  const [fullName, setFullName] = React.useState<string>(storedName || "")
  const [password, setPassword] = React.useState<string>("")
  const [errors, setErrors] = React.useState<{ fullName?: string; password?: string }>({})
  const [selectedFileName, setSelectedFileName] = React.useState<string>("")

  React.useEffect(() => {
    if (!user) return
    setFullName(user.full_name)
    setPassword("")

    const picId = user.profile_picture_id ?? storedPictureId
    const picUrl = user.profile_picture_url ?? storedPictureUrl
    setProfile(user.full_name, picId, picUrl)
  }, [user, storedPictureId, storedPictureUrl, setProfile])

  const validate = React.useCallback(() => {
    const e: typeof errors = {}
    if (fullName.trim().length < 5 || fullName.trim().length > 64)
      e.fullName = "O nome deve ter entre 5 e 64 caracteres."
    if (password && password.length < 8)
      e.password = "A senha deve ter ao menos 8 caracteres."
    setErrors(e)
    return Object.keys(e).length === 0
  }, [fullName, password])

  // ——————————————
  // 1) Upload Mutation (corrigido — chave 'profile-asset' + apiClient)
  // ——————————————
  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<FileUploadResponse> => {
      const fd = new FormData()
      // ⬇️ nome EXATO que o backend espera
      fd.append("profile-asset", file, file.name)

      // use o alias que criamos ou chame direto o proxy de files:
      // a) alias:
      const data = await apiPost<any>("/api/users/upload-profile-picture", fd)
      // b) direto (se preferir): await apiPost<any>("/api/files/upload-profile-assets", fd)

      // mapeia formatos possíveis de resposta
      const file_id: string =
        data?.profile_picture_id ?? data?.file_id ?? data?.id ?? data?.file?.id

      const url: string | undefined =
        data?.profile_picture_url ??
        data?.url ??
        data?.file?.url ??
        (file_id ? `/api/files/${file_id}` : undefined)

      if (!file_id) {
        throw new Error("Upload concluído, mas o backend não retornou o ID do arquivo.")
      }
      return { file_id, url }
    },
    onMutate: (file: File) => {
      setSelectedFileName(file.name)
    },
    onSuccess: (data: FileUploadResponse) => {
      // atualiza cache do usuário
      if (user) {
        qc.setQueryData<User>(["user"], (old) =>
          old
            ? {
                ...old,
                profile_picture_id: data.file_id,
                profile_picture_url: data.url,
              }
            : old!
        )
      }
      // persiste no store
      setProfile(fullName, data.file_id, data.url)
      // (opcional) reforça atualização por segurança
      qc.invalidateQueries({ queryKey: ["user"] })
      addToast({ title: "Imagem enviada com sucesso!", color: "success" })
    },
    onError: (err: Error) => {
      addToast({
        title: "Erro no upload",
        description: err.message || "Não foi possível enviar a imagem.",
        color: "danger",
      })
    },
  })
  const { mutate: uploadProfilePicture, isPending: uploading } = uploadMutation

  // ——————————————————
  // 2) Save Profile Mutation (alinhado a /api/users/:id)
  // ——————————————————
  const saveMutation = useMutation({
    mutationFn: async (): Promise<Partial<User>> => {
      if (!user) throw new Error("Usuário não definido")

      // valida campos simples client-side
      if (!validate()) throw new Error("Há erros no formulário.")

      const body: any = { full_name: fullName.trim() }
      if (password) body.password = password
      if (storedPictureId) body.profile_picture_id = storedPictureId

      const data = await apiPut<any>(`/api/users/${user.user_id}`, body)
      return data as Partial<User>
    },
    onSuccess: (data: Partial<User>) => {
      if (user) {
        qc.setQueryData<User>(["user"], (old) =>
          old ? { ...old, full_name: data.full_name ?? old.full_name } : old!
        )
      }
      setProfile(data.full_name ?? fullName, storedPictureId, storedPictureUrl)
      addToast({ title: "Perfil atualizado", color: "success" })
    },
    onError: (err: Error) => {
      addToast({
        title: "Erro ao salvar",
        description: err.message || "Não foi possível salvar as alterações.",
        color: "danger",
      })
    },
  })
  const { mutate: handleSave, isPending: saving } = saveMutation

  return {
    user,
    isLoading,
    isError,

    fullName,
    setFullName,
    password,
    setPassword,
    errors,
    selectedFileName,

    profilePictureUrl: storedPictureUrl,
    profilePictureId: storedPictureId,
    uploading,
    saving,

    uploadProfilePicture,
    handleSave,
  }
}
