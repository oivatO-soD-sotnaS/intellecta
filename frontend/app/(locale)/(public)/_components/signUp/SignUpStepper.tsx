// app/(locale)/(public)/_components/signUp/SignUpStepper.tsx
"use client"

import Stepper, { Step, StepperRef } from "@/components/ui/stepper"
import React, { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { SignUpForm } from "./SignUpForm"
import { VerifyEmailForm } from "./VerifyEmailForm"
import { PrimaryButton } from "../PrimaryButton"
import NameStep from "../NameStep"

type StepperClassOverrides = {
  stepCircleContainerClassName?: string
  stepContainerClassName?: string
  contentClassName?: string
  footerClassName?: string
}

interface Props {
  classes?: StepperClassOverrides
}

export default function SignUpStepper({ classes }: Props) {
  const stepperRef = useRef<StepperRef>(null)

  const [currentStep, setCurrentStep] = useState(1)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")

  // apenas pending
  const [form2, setForm2] = useState<{ isPending: boolean }>({
    isPending: false,
  })
  const [form3, setForm3] = useState<{ isPending: boolean }>({
    isPending: false,
  })

  const router = useRouter()
  const handleFinal = () => router.push("/home")

  const nameValid = fullName.trim().length >= 5 && fullName.trim().length <= 64

  const submitById = useCallback((id?: string) => {
    if (!id) return
    const el = document.getElementById(id) as HTMLFormElement | null
    el?.requestSubmit?.()
  }, [])
  const handleForm2State = useCallback(
    (s: { isPending: boolean }) => setForm2(s),
    []
  )
  const handleForm3State = useCallback(
    (s: { isPending: boolean }) => setForm3(s),
    []
  )

  const nextLabel =
    currentStep === 1
      ? "Continuar"
      : currentStep === 2
        ? "Cadastrar"
        : currentStep === 3
          ? "Verificar"
          : "Concluir"

  const nextDisabled =
    currentStep === 1
      ? !nameValid
      : currentStep === 2
        ? form2.isPending
        : currentStep === 3
          ? form3.isPending
          : false

  const nextLoading =
    currentStep === 2
      ? form2.isPending
      : currentStep === 3
        ? form3.isPending
        : false

  const backDisabled =
    (currentStep === 2 && form2.isPending) ||
    (currentStep === 3 && form3.isPending)

  return (
      <Stepper
        className="w-auto"
        ref={stepperRef}
        initialStep={1}
        onStepChange={setCurrentStep}
        onFinalStepCompleted={handleFinal}
        backButtonText="Voltar"
        renderNextButton={({ isLastStep, handleNext, handleComplete }) => (
          <PrimaryButton
            onPress={() => {
              if (currentStep === 1) {
                if (nameValid) handleNext()
                return
              }
              if (currentStep === 2) {
                submitById("sign-up-form")
                return
              }
              if (currentStep === 3) {
                submitById("verify-email-form")
                return
              }
              if (isLastStep) handleComplete()
            }}
            isDisabled={nextDisabled}
            isLoading={nextLoading}
            fullWidth={false}
            className="rounded-full"
            disableRipple
          >
            {nextLabel}
          </PrimaryButton>
        )}
        backButtonProps={{ disabled: backDisabled }}
        stepCircleContainerClassName={` w-full bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl
          shadow-[0_24px_80px_rgba(82,39,255,0.18),0_10px_30px_rgba(0,0,0,0.10)]
          dark:shadow-[0_24px_80px_rgba(82,39,255,0.25),0_10px_30px_rgba(0,0,0,0.35)]
        `}
        stepContainerClassName={`px-10 py-8 ${classes?.stepContainerClassName ?? ""}`}
        contentClassName={`px-10 pb-6 ${classes?.contentClassName ?? ""}`}
        footerClassName={`px-10 ${classes?.footerClassName ?? ""}`}
      >
        {/* STEP 1: Nome */}
        <Step>
          <NameStep fullName={fullName} onChange={setFullName} />
        </Step>

        {/* STEP 2: Formulário */}
        <Step>
          <SignUpForm
            fullName={fullName}
            formId="sign-up-form"
            onFormStateChange={handleForm2State}
            onSuccess={(e) => {
              setEmail(e)
              stepperRef.current?.next()
            }}
          />
        </Step>

        {/* STEP 3: Verificação de E-mail */}
        <Step>
          <VerifyEmailForm
            email={email}
            formId="verify-email-form"
            onFormStateChange={handleForm3State}
            onVerified={() => stepperRef.current?.next()}
          />
        </Step>

        {/* STEP 4: Conclusão */}
        <Step>
          <div className="text-center space-y-4 px-8 py-6">
            <h2 className="text-2xl font-bold">Tudo Pronto!</h2>
            <p className="text-lg">Cadastro concluído com sucesso.</p>
          </div>
        </Step>
      </Stepper>
  )
}
