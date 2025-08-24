"use client"

import React, { Children, ReactElement } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "next-themes"
import { StepperProvider, useStepper } from "./StepperContext"
import { Card, CardContent } from "@/components/ui/card"
import { MagicCard } from "@/components/magicui/magic-card"
import { redirect } from "next/navigation"

/* ========== API de alto nível ========== */
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

/* ========== Shell + Header centralizado + MagicCard ========== */
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

  // tema: só decide a cor do gradiente depois de montar (evita mismatch)
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  const gradient = mounted
    ? theme === "dark"
      ? "#262626"
      : "#D9D9D955"
    : "#262626"

  const handlePrimary = () => {
    if (cur.onNext) return cur.onNext()
    if (cur.formId) {
      const f = document.getElementById(cur.formId) as HTMLFormElement | null
      if (f?.requestSubmit) f.requestSubmit()
      else f?.submit()
      return
    }
    if (isLast) complete()
    else nextStep()
  }

  if (isCompleted) redirect("/home")

  return (
    <div className={`mx-auto w-full ${className ?? ""}`}>
      <div className="md:mx-40 sm:mx-16 lg:mx-40 mx-6  w-full max-w-3xl px-4">
        <StepperHeader titles={titles} />
      </div>

      {/* CONTEÚDO */}
      <div className="mx-auto mt-6 w-full max-w-3xl px-4">
        <Card className="p-0 shadow-none bg-transparent border-none">
          <MagicCard gradientColor={gradient} className="p-0">
            <CardContent className="p-6 md:p-8">
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
                        className="rounded px-3 py-2 text-foreground/70 hover:text-foreground disabled:opacity-50"
                      >
                        Voltar
                      </button>

                      <button
                        type="button"
                        onClick={handlePrimary}
                        disabled={!!cur.nextDisabled || !!cur.nextLoading}
                        className="rounded-full bg-primary px-6 py-2 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 cursor-pointer"
                      >
                        {cur.nextLoading ? "Enviando..." : nextText}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </MagicCard>
        </Card>
      </div>
    </div>
  )
}

/* ========== Header com pontos + linhas (centralizado) ========== */
function StepperHeader({ titles }: { titles: string[] }) {
  const { currentStep, totalSteps, goToStep } = useStepper()

  return (
    <div className="mb-4 flex w-full items-center justify-center">
      <div className="flex w-full max-w-3xl items-center gap-2 md:gap-4">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const n = i + 1
          const active = n === currentStep
          const done = n < currentStep
          const canGo = n < currentStep
          const label = titles[i] ?? `Passo ${n}`

          return (
            <div key={n} className="flex min-w-0 flex-1 items-center">
              <button
                type="button"
                aria-current={active ? "step" : undefined}
                aria-label={label}
                disabled={!canGo}
                onClick={() => canGo && goToStep(n)}
                className="group flex shrink-0 items-center gap-3 focus:outline-none disabled:cursor-default"
              >
                <span
                  className={[
                    "grid h-9 w-9 place-items-center rounded-full border-2 transition",
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : active
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border bg-secondary text-muted-foreground",
                  ].join(" ")}
                >
                  {done ? (
                    <span className="inline-block h-2 w-3 -rotate-45 border-b-2 border-l-2 border-current" />
                  ) : (
                    <span className="text-[13px] font-semibold">{n}</span>
                  )}
                </span>

                <span
                  className={[
                    "hidden min-w-0 text-sm md:block",
                    active ? "text-primary" : "text-muted-foreground",
                  ].join(" ")}
                >
                  <span className="block truncate">{label}</span>
                </span>
              </button>

              {n < totalSteps && (
                <div
                  className={[
                    "mx-3 h-0.5 flex-1 rounded-full md:block",
                    n < currentStep ? "bg-primary" : "bg-border",
                  ].join(" ")}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}



/* ========== Slot do Step ========== */
export function Step({ children }: { children: React.ReactNode }) {
  return <div className="px-0 md:px-2">{children}</div>
}
