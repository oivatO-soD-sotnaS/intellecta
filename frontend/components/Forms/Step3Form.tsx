"use client"

import React, { useEffect } from "react"
import { useStepper } from "@/components/Stepper/StepperContext"
import { VerifyEmailForm } from "@/app/(locale)/(public)/_components/signUp/VerifyEmailForm"

export default function Step3Form({ email }: { email: string }) {
  const { setFooterState, complete, nextStep } = useStepper()

  // configura o footer apenas 1x
  useEffect(() => {
    setFooterState({
      formId: "verify-email-form",
      nextLabel: "Verificar",
      nextDisabled: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // recebe o gatilho estável do form para o botão do footer
  const receiveSubmit = (fn: () => void) => setFooterState({ onNext: fn })

  return (
    <div className="space-y-6">
      <VerifyEmailForm
        email={email}
        formId="verify-email-form"
        exposeStableSubmit={receiveSubmit}
        onFormStateChange={(s) => setFooterState({ nextLoading: s.isPending })}
        onValidityChange={(valid) => setFooterState({ nextDisabled: !valid })}
        onVerified={() => {
          // avance mais um passo se houver, ou conclua o fluxo
          nextStep()
          complete()
        }}
      />
    </div>
  )
}
