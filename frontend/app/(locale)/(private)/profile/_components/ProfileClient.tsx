// app/(locale)/(private)/profile/ProfileClient.tsx
"use client"

import React from "react"
import { Avatar } from "@heroui/avatar"
import { Spinner } from "@heroui/spinner"

import { useProfileForm } from "../hooks/useProfileForm"
import { useProfileAnimations } from "../hooks/useProfileAnimations"

import { InputField } from "@/app/(locale)/(public)/_components/InputField"
import { PasswordInput } from "@/app/(locale)/(public)/_components/PasswordInput"
import { PrimaryButton } from "@/app/(locale)/(public)/_components/PrimaryButton"
import FileInputCustom from "@/components/Inputs/FileInputCustom"

export default function ProfileClient() {
  const {
    user,
    isLoading,
    isError,
    fullName,
    setFullName,
    password,
    setPassword,
    profilePictureUrl,
    profilePictureId,
    uploadProfilePicture,
    uploading,
    errors,
    saving,
    handleSave,
  } = useProfileForm()

  useProfileAnimations(isLoading, user, errors)

  if (isLoading)
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    )
  if (isError || !user)
    return (
      <div className="flex justify-center py-8 text-red-600">
        Erro ao carregar perfil.
      </div>
    )

  return (
    <div className="max-w-lg mx-auto space-y-6 py-8">
      <h1 className="profile-title text-2xl font-semibold text-center opacity-0">
        Meu Perfil
      </h1>

      {/*TODO: Fazer um passo de crop & reposition antes do upload (react-easy-crop)  */}
      <div className="flex justify-center">
        {uploading ? (
          <Spinner size="lg" />
        ) : (
          <Avatar
            className="profile-avatar w-24 h-24"
            size="lg"
            src={profilePictureUrl || `/api/files/${profilePictureId}`}
          />
        )}
      </div>

      <div className="flex flex-col gap-7">
        <InputField
          isRequired
          className={`form-field opacity-0 ${errors.fullName ? "is-invalid" : ""}`}
          errorMessage={errors.fullName}
          isInvalid={!!errors.fullName}
          label="Nome completo"
          placeholder="Nome completo"
          value={fullName}
          onChange={setFullName}
        />

        <PasswordInput
          className={`form-field opacity-0 ${errors.password ? "is-invalid" : ""}`}
          errorMessage={errors.password}
          isInvalid={!!errors.password}
          label="Nova senha (opcional)"
          value={password}
          onChange={setPassword}
        />

        <div className="form-field opacity-0 cursor-pointer">
          <FileInputCustom
            uploadProfilePicture={uploadProfilePicture}
            uploading={uploading}
          />
        </div>
      </div>

      <PrimaryButton
        className="primary-btn"
        isLoading={saving}
        onClick={handleSave}
        onMouseEnter={() =>
          import("animejs").then(({ animate }) =>
            animate(".primary-btn", {
              scale: 1.03,
              duration: 150,
              ease: "outQuad",
            })
          )
        }
        onMouseLeave={() =>
          import("animejs").then(({ animate }) =>
            animate(".primary-btn", {
              scale: 1,
              duration: 150,
              ease: "outQuad",
            })
          )
        }
      >
        Salvar alterações
      </PrimaryButton>
    </div>
  )
}
