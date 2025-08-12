// SignUpStepper.tsx
"use client"

import Stepper, { Step, StepperRef } from "@/components/ui/stepper"
import React, { useRef, useState } from "react"
import { SignUpForm } from "./SignUpForm"
import { VerifyEmailForm } from "./VerifyEmailForm"
import { useRouter } from "next/navigation"

export default function SignUpStepper() {
  const stepperRef = useRef<StepperRef>(null)

  const [email, setEmail] = useState("")
  const router = useRouter()

  const handleFinal = () => {
    router.push("/home")
  }

  return (
    <Stepper
      ref={stepperRef}
      initialStep={1}
      onFinalStepCompleted={handleFinal}
      backButtonText="Voltar"
      nextButtonText="Continuar"
    >
      {/* === Passo 1 === */}
      <Step>
        <div className="text-center space-y-4 px-8">
          <h1 className="text-2xl font-bold">Bem-vindo ao Intellecta</h1>
          <p className="text-lg">
            “Seja bem-vindo ao Intellecta — o lugar onde cada clique abre portas
            para descobertas surpreendentes e transforma sonhos em conquistas
            reais.”
          </p>
        </div>
      </Step>

      {/* === Passo 2 === */}
      <Step>
        <SignUpForm
          onSuccess={(e) => {
            setEmail(e)
            stepperRef.current?.next()
          }}
        />
      </Step>
      {/* === STEP 3: Verificação de E-mail === */}
      <Step>
        <VerifyEmailForm
          email={email}
          onVerified={() => stepperRef.current?.next()}
        />
      </Step>

      {/* === STEP 4: Conclusão === */}
      <Step>
        <div className="text-center space-y-4 px-8 py-4">
          <h2 className="text-2xl font-bold">Tudo Pronto!</h2>
          <p className="text-lg">
            Parabéns, seu cadastro foi concluído com sucesso. Agora é só acessar
            e explorar o Intellecta.
          </p>
          {/* Sem botão aqui para evitar duplicar com o "Complete" do Stepper */}
          {/* O clique em "Complete" (rodapé do Stepper) chamará onFinalStepCompleted */}
        </div>
      </Step>
    </Stepper>
  )
}
