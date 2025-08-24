"use client"
import React, { useEffect, useState } from "react"
import { useStepper } from "@/components/Stepper/StepperContext"

type Step1FormProps = {
  /** Recebe o nome válido para ser usado no Step 2 */
  onNext?: (name: string) => void
}

export default function Step1Form({ onNext }: Step1FormProps) {
  const { setFooterState, nextStep } = useStepper()
  const [name, setName] = useState("")

  const isValid = name.trim().length >= 5 && name.trim().length <= 64

  useEffect(() => {
    // Configura o footer sempre que o valor de 'name' mudar
    setFooterState({
      formId: "name-step-form",
      nextLabel: "Continuar",
      nextDisabled: !isValid,
    })
  }, [isValid, setFooterState])

  return (
    <form
      id="name-step-form"
      onSubmit={(e) => {
        e.preventDefault()
        if (!isValid) return
        // envia o nome para o wrapper (SignUpClient)
        onNext?.(name.trim())
        // avança para o próximo passo
        nextStep()
      }}
      className="space-y-4"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Bem-vindo!</h2>
        <p className="text-neutral-500">
          Vamos começar com suas informações pessoais
        </p>
      </div>

      <label className="block text-sm font-medium">Nome completo *</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Digite seu nome completo"
        className="w-full rounded-md border border-neutral-300 px-3 py-2"
        autoComplete="name"
      />
      {/* opcional: pequena ajuda de validação */}
      {!isValid && name.length > 0 && (
        <p className="text-xs text-red-600">
          O nome deve ter entre 5 e 64 caracteres.
        </p>
      )}
    </form>
  )
}
