"use client"

import React from "react"
import { StepperRoot } from "@/components/Stepper/Stepper"
import { Step } from "@/components/Stepper/Step"

import Step1Form from "@/components/Forms/Step1Formt"
import Step2Form from "@/components/Forms/Step2Form"
import Step3Form from "@/components/Forms/Step3Form"

export default function SignUpClient() {
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")

  return (
    <div className="min-h-dvh bg-gradient-to-b from-indigo-50 to-white py-10">
      <StepperRoot
        totalSteps={3}
        titles={["Informações Pessoais", "Criar Conta", "Verificação"]}
        onCompleted={() => {
          /* ex.: router.push("/home") */
        }}
      >
        <Step>
          <Step1Form onNext={(name) => setFullName(name)} />
        </Step>

        <Step>
          <Step2Form
            fullName={fullName}
            onSignedUp={(e) => setEmail(e)} 
          />
        </Step>

        <Step>
          <Step3Form email={email} />
        </Step>
      </StepperRoot>
    </div>
  )
}
