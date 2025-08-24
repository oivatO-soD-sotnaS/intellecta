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

export default function SignUpClient() {
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")

  const { theme,  } = useTheme()


  return (
    <section
      className="
        relative isolate
        min-h-[100svh] 
        bg-background text-foreground
        overflow-x-hidden 
        font-sans
      "
    >
      {/* BG atrás de tudo, sem interferir no layout */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <DarkVeil background={`${theme === "light" ? "white" : "black"}`} />
      </div>

      {/* grid = header | conteúdo | footer */}
      <div className="relative grid min-h-[100svh] grid-rows-[auto,1fr,auto]">
        {/* HEADER centralizado no mesmo container do conteúdo */}
        <header className="relative z-10">
          <div className="mx-auto w-full max-w-5xl px-4 py-6">
            <Header />
          </div>
        </header>

        {/* CONTEÚDO: central no eixo horizontal; no vertical usamos espaçamento sutil */}
        <main className="relative z-10 mx-auto w-full max-w-5xl px-4 py-4 md:py-8">
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

        {/* FOOTER enxuto (evita “altura imensa”) */}
        <footer className="relative z-10 px-4 py-4">
          <div className="mx-auto w-full max-w-5xl">
            <LegalLinks />
          </div>
        </footer>
      </div>
    </section>
  )
}
