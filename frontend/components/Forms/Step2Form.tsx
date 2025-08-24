"use client"

import React, { useEffect } from "react"
import { useStepper } from "@/components/Stepper/StepperContext"
import { SignUpForm } from "@/app/(locale)/(public)/_components/signUp/SignUpForm"

export default function Step2Form({
  fullName,
  onSignedUp,
}: {
  fullName: string
  onSignedUp: (email: string) => void
}) {
  const { setFooterState, nextStep } = useStepper()

  useEffect(() => {
    setFooterState({
      formId: "sign-up-form",
      nextLabel: "Cadastrar",
      nextDisabled: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // recebe submit estável do form (opcional; o botão do footer já chama direto também)
  const receiveSubmit = (fn: () => void) => setFooterState({ onNext: fn })

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Criar Conta</h2>
        <p className="text-neutral-500">
          Preencha seu e-mail, senha e confirme o reCAPTCHA
        </p>
      </div>

      <SignUpForm
        fullName={fullName}
        formId="sign-up-form"
        exposeStableSubmit={receiveSubmit}
        onFormStateChange={(s) => setFooterState({ nextLoading: s.isPending })}
        onValidityChange={(valid) => setFooterState({ nextDisabled: !valid })}
        onSuccess={(email) => {
          onSignedUp(email) 
          nextStep() 
        }}
      />
    </div>
  )
}
