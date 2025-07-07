/* eslint-disable @typescript-eslint/no-unused-vars */
// app/(locale)/(private)/profile/hooks/useProfileForm.ts
"use client"

import React from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { addToast } from "@heroui/toast"

import { useUser } from "../../hooks/useUser"
import { useProfileStore } from "../store/profileStore"

// === Tipagens ===
interface User {
  user_id: string
  full_name: string
  profile_picture_id?: string
  profile_picture_url?: string
}

interface FileUploadResponse {
  file_id: string
  url: string
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
  const [errors, setErrors] = React.useState<{
    fullName?: string
    password?: string
  }>({})
  const [selectedFileName, setSelectedFileName] = React.useState<string>("")

  React.useEffect(() => {
    if (!user) return

    // atualiza o campo de texto
    setFullName(user.full_name)
    setPassword("")

    // merge: se user vier com picture, usa; senão, preserva o que havia no store
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
  // 1) Upload Mutation (Corrigido)
  // ——————————————
  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<FileUploadResponse> => {
      const form = new FormData()

      form.append("profile-picture", file)

      const res = await fetch("/api/users/upload-profile-picture", {
        method: "POST",
        credentials: "include",
        body: form,
      })
      const payload = await res.json()

      if (!res.ok) throw new Error(payload.error?.message || "Erro no upload")

      return payload as FileUploadResponse
    },
    onMutate: (file: File) => {
      setSelectedFileName(file.name)
    },
    onSuccess: (data: FileUploadResponse) => {
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
      setProfile(fullName, data.file_id, data.url)
      addToast({ title: "Imagem enviada com sucesso!", color: "success" })
    },
    onError: (err: Error) => {
      addToast({
        title: "Erro no upload",
        description: err.message,
        color: "danger",
      })
    },
  })
  const { mutate: uploadProfilePicture, isPending: uploading } = uploadMutation

  // ——————————————————
  // 2) Save Profile Mutation (Corrigido)
  // ——————————————————
  const saveMutation = useMutation({
    mutationFn: async (): Promise<Partial<User>> => {
      if (!user) throw new Error("Usuário não definido")
      const body: any = { full_name: fullName.trim() }

      if (password) body.password = password
      if (storedPictureId) body.profile_picture_id = storedPictureId

      const res = await fetch(`/api/users/${user.user_id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const payload = await res.json()

      if (!res.ok)
        throw new Error(payload.error || payload.message || "Erro ao salvar")

      return payload as Partial<User>
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
        description: err.message,
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
