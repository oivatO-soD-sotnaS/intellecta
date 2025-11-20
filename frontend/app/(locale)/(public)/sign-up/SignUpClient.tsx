"use client"

import React from "react"
import Header from "../_components/Header"
import LegalLinks from "../_components/LegalLinks"

import { StepperRoot, Step } from "@/components/Stepper/Stepper"
import Step1Form from "@/components/Forms/Step1Formt"
import Step2Form from "@/components/Forms/Step2Form"
import Step3Form from "@/components/Forms/Step3Form"

import DarkVeil from "@/components/ui/darkveil"
import { useTheme } from "next-themes"
import { Boxes } from "@/components/ui/background-boxes"

export default function SignUpClient() {
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")

  const { theme } = useTheme()

  return (
    <section
      className="
        relative 
        min-h-[100svh] 
        bg-background text-foreground
        overflow-hidden 
        font-sans
      "
    >
      {/* Background fixo sem causar scroll */}
      <div className="fixed inset-0  overflow-hidden">
        <div className="absolute inset-0">
          <Boxes />
        </div>
      </div>

      {/* Conteúdo principal com scroll se necessário */}
      <div className="relative z-10 min-h-[100svh] flex flex-col">
        {/* HEADER */}
        <header className="flex-shrink-0">
          <div className="mx-auto w-full max-w-5xl px-4 py-6">
            <Header />
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL - cresce para ocupar espaço disponível */}
        <main className="flex-grow mx-auto w-full max-w-5xl px-4 py-4 md:py-8">
          <StepperRoot
            totalSteps={3}
            titles={["Nome completo", "Criar Conta", "Verificação"]}
            onCompleted={() => {}}
          >
            <Step>
              <Step1Form onNext={(name) => setFullName(name)} />
            </Step>

            <Step>
              <Step2Form fullName={fullName} onSignedUp={(e) => setEmail(e)} />
            </Step>

            <Step>
              <Step3Form email={email} />
            </Step>
          </StepperRoot>
        </main>

        {/* FOOTER */}
        <footer className="flex-shrink-0 px-4 py-4">
          <div className="mx-auto w-full max-w-5xl">
            <LegalLinks />
          </div>
        </footer>
      </div>
    </section>
  )
}
