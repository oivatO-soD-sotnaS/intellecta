// app/(locale)/(private)/profile/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar } from "@heroui/avatar"
import { addToast } from "@heroui/toast"

import { InputField } from "../../(public)/_components/InputField"
import { PasswordInput } from "../../(public)/_components/PasswordInput"
import { PrimaryButton } from "../../(public)/_components/PrimaryButton"
import { useUser } from "../hooks/useUser"

interface FieldErrors {
  fullName?: string
  password?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, userId, token, loading } = useUser()

  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [pictureUrl, setPictureUrl] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSaving, setIsSaving] = useState(false)

  // 1) Quando o usuário é carregado, pré-preenchemos os campos
  useEffect(() => {
    if (user) {
      setFullName(user.full_name)
      setPassword("") // campo em branco
      setPictureUrl(user.profile_picture_id ?? "")
    }
  }, [user])

  // 2) Se não estiver autenticado, volta pro login
  useEffect(() => {
    if (!loading && !token) {
      router.push("/sign-in")
    }
  }, [loading, token, router])

  // 3) Enquanto carrega ou não tivermos user, exibimos carregando
  if (loading || !user) {
    return <div>Carregando perfil…</div>
  }

  // 4) Função de validação
  const validate = () => {
    const e: FieldErrors = {}

    if (fullName.trim().length < 5) {
      e.fullName = "O nome deve ter entre 5 e 64 caracteres."
    }
    if (password && password.length < 8) {
      e.password = "A senha deve ter ao menos 8 caracteres."
    }
    setErrors(e)

    return Object.keys(e).length === 0
  }

  // 5) Envio do PATCH
  const handleSave = async () => {
    if (!validate() || !userId) return
    setIsSaving(true)
    try {
      const body: any = { full_name: fullName.trim() }

      if (password) body.password = password
      if (pictureUrl) body.profile_picture_url = pictureUrl.trim()

      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      const payload = await res.json()

      if (!res.ok) {
        throw new Error(payload.error?.message || payload.message)
      }

      addToast({
        title: "Perfil atualizado!",
        description: "Seus dados foram salvos com sucesso.",
        color: "success",
      })
    } catch (err: any) {
      addToast({
        title: "Erro ao salvar",
        description: err.message,
        color: "danger",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 6) JSX final
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Meu Perfil</h1>

      <div className="flex items-center gap-4">
        <Avatar
          size="lg"
          src={pictureUrl ? `/api/files/${pictureUrl}` : undefined}
        />
        <div>
          <p className="font-medium">{user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <InputField
          isRequired
          errorMessage={errors.fullName}
          isInvalid={!!errors.fullName}
          label="Nome completo"
          placeholder="Nome completo"
          value={fullName}
          onChange={setFullName}
        />

        <PasswordInput
          errorMessage={errors.password}
          isInvalid={!!errors.password}
          label="Nova senha (opcional)"
          placeholder="Deixe em branco para manter"
          value={password}
          onChange={setPassword}
        />

        <InputField
          label="URL da foto (opcional)"
          placeholder="https://..."
          value={pictureUrl}
          onChange={setPictureUrl}
        />
      </div>

      <PrimaryButton
        isDisabled={isSaving}
        isLoading={isSaving}
        onClick={handleSave}
      >
        Salvar alterações
      </PrimaryButton>
    </div>
  )
}
