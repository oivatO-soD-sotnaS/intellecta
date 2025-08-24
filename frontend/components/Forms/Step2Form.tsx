"use client"

import React, { useEffect } from "react"
import { useStepper } from "@/components/Stepper/StepperContext"
import { SignUpForm } from "@/app/(locale)/(public)/_components/signUp/SignUpForm"


type LastPayload = {
  full_name: string
  email: string
  password: string
  isHuman: boolean
}


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
  }, [setFooterState])

  // recebe submit estável do form (opcional; o botão do footer já chama direto também)
  const receiveSubmit = (fn: () => void) => setFooterState({ onNext: fn })

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Criar Conta</h2>
        <p className="text-neutral-500">Preencha as informações abaixo</p>
      </div>

      <SignUpForm
        fullName={fullName}
        formId="sign-up-form"
        exposeStableSubmit={receiveSubmit}
        onFormStateChange={(s) => setFooterState({ nextLoading: s.isPending })}
        onValidityChange={(valid) => setFooterState({ nextDisabled: !valid })}
        onSuccess={(email, payload) => {
          // guarda para “Reenviar” no Step 3
          try {
            const last: LastPayload = {
              full_name: payload.full_name,
              email: payload.email,
              password: payload.password,
              isHuman: payload.isHuman,
            }
            sessionStorage.setItem("signup:last-payload", JSON.stringify(last))
          } catch {}
          onSignedUp(email)
          nextStep()
        }}
      />
    </div>
  )
}
