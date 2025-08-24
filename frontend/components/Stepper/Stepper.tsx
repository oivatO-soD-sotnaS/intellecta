"use client"

import React, { Children, ReactElement } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { StepperProvider, useStepper } from "./StepperContext"

export function StepperRoot({
  children,
  totalSteps,
  onCompleted,
  titles = [],
  className,
}: {
  children: React.ReactNode
  totalSteps: number
  onCompleted?: () => void
  titles?: string[]
  className?: string
}) {
  return (
    <StepperProvider totalSteps={totalSteps} onCompleted={onCompleted}>
      <StepperShell titles={titles} className={className}>
        {children}
      </StepperShell>
    </StepperProvider>
  )
}

function StepperShell({
  children,
  titles = [],
  className,
}: {
  children: React.ReactNode
  titles?: string[]
  className?: string
}) {
  const {
    currentStep,
    totalSteps,
    prevStep,
    nextStep,
    complete,
    isCompleted,
    footerState,
  } = useStepper()

  const stepsArray = Children.toArray(children) as ReactElement[]
  const isLast = currentStep === totalSteps

  const cur = footerState[currentStep] || {}
  const nextText = cur.nextLabel ?? (isLast ? "Concluir" : "Continuar")

  const handlePrimary = () => {
    // prioridade para ação direta
    if (cur.onNext) {
      cur.onNext()
      return
    }
    // fallback para formId (DOM)
    if (cur.formId) {
      const f = document.getElementById(cur.formId) as HTMLFormElement | null
      if (f?.requestSubmit) f.requestSubmit()
      else f?.submit()
      return
    }
    // último fallback
    if (isLast) complete()
    else nextStep()
  }

  return (
    <div className={`mx-auto w-full max-w-3xl ${className ?? ""}`}>
      {/* header */}
      <div className="mb-6 flex items-center justify-center gap-10">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const n = i + 1
          const active = n === currentStep
          const done = n < currentStep
          return (
            <div key={n} className="flex items-center gap-3">
              <div
                className={`grid h-10 w-10 place-items-center rounded-full border-2 transition ${
                  active
                    ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                    : done
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-neutral-300 bg-neutral-50 text-neutral-500"
                }`}
              >
                <span className="text-sm font-semibold">{n}</span>
              </div>
              <div
                className={`text-sm ${
                  active ? "text-indigo-600" : "text-neutral-400"
                }`}
              >
                {titles[i] ?? `Passo ${n}`}
              </div>
            </div>
          )
        })}
      </div>

      {/* conteúdo + footer ÚNICO */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-md">
        <AnimatePresence mode="wait">
          {!isCompleted && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {stepsArray[currentStep - 1] || null}

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1 || !!cur.backDisabled}
                  className="rounded px-3 py-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-50"
                >
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={handlePrimary}
                  disabled={!!cur.nextDisabled || !!cur.nextLoading}
                  className="rounded-full bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {cur.nextLoading ? "Enviando..." : nextText}
                </button>
              </div>
            </motion.div>
          )}

          {isCompleted && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold">Concluído!</h2>
              <p className="text-neutral-500">Cadastro finalizado.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
