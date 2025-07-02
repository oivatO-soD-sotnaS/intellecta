"use client"
import { Avatar } from "@heroui/avatar"
import { addToast } from "@heroui/toast"
import React from "react"

import { InputField } from "../../(public)/_components/InputField"
import { PasswordInput } from "../../(public)/_components/PasswordInput"
import { PrimaryButton } from "../../(public)/_components/PrimaryButton"
import { useUser } from "../hooks/useUser"

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useUser()
  const [fullName, setFullName] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [pictureUrl, setPictureUrl] = React.useState("")
  const [errors, setErrors] = React.useState<{
    fullName?: string
    password?: string
  }>({})
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (user) {
      setFullName(user.full_name)
      setPictureUrl(user.profile_picture_id || "")
    }
  }, [user])

  if (isLoading) return <div>Carregando…</div>
  if (isError || !user) return <div>Erro ao carregar perfil.</div>

  const validate = () => {
    const e: typeof errors = {}

    if (fullName.trim().length < 5)
      e.fullName = "O nome deve ter entre 5 e 64 caracteres."
    if (password && password.length < 8)
      e.password = "A senha deve ter ao menos 8 caracteres."
    setErrors(e)

    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const body: any = { full_name: fullName.trim() }

      if (password) body.password = password
      if (pictureUrl) body.profile_picture_url = pictureUrl.trim()

      const res = await fetch(`/api/users/${user.user_id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const payload = await res.json()

      if (!res.ok) throw new Error(payload.error || payload.message)

      addToast({ title: "Perfil atualizado", color: "success" })
      // Optionally refetch user
    } catch (err: any) {
      addToast({
        title: "Erro ao salvar",
        description: err.message,
        color: "danger",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Meu Perfil</h1>
      <Avatar
        size="lg"
        src={
          user.profile_picture_id
            ? `/api/files/${user.profile_picture_id}`
            : undefined
        }
      />
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
        value={password}
        onChange={setPassword}
      />
      <InputField
        label="URL da foto de perfil (opcional)"
        placeholder="Url"
        value={pictureUrl}
        onChange={setPictureUrl}
      />
      <PrimaryButton isLoading={saving} onClick={handleSave}>
        Salvar alterações
      </PrimaryButton>
    </div>
  )
}
