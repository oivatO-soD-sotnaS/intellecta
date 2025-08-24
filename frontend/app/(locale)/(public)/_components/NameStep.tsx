// app/(locale)/(public)/_components/signUp/NameStep.tsx
"use client"

import React from "react"
import { InputField } from "./InputField"
import { PrimaryButton } from "./PrimaryButton"

interface NameStepProps {
  fullName: string
  onChange: (v: string) => void
  onContinue?: () => void
}

export default function NameStep({
  fullName,
  onChange,
  onContinue,
}: NameStepProps) {
  const trimmed = fullName.trim()
  const isInvalid =
    trimmed.length > 0 && (trimmed.length < 5 || trimmed.length > 64)
  const isValid = trimmed.length >= 5 && trimmed.length <= 64

  return (
    <div className="px-8 py-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Como podemos te chamar?</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Diga seu nome para personalizarmos sua experiência.
        </p>
      </div>

      <div
        onKeyDown={(e) => {
          if (e.key === "Enter" && isValid) {
            e.preventDefault()
            onContinue?.()
          }
        }}
      >
        <InputField
          name="fullName"
          label="Nome completo:"
          variant="underlined"
          value={fullName}
          onChange={onChange}
          isInvalid={isInvalid}
          errorMessage={isInvalid && "O nome deve ter entre 5 e 64 caracteres."}
          isRequired
          className="bg-transparent"
        />
      </div>


    </div>
  )
}
