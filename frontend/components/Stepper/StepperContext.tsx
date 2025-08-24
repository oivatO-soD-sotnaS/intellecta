"use client"

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from "react"

export type FooterState = {
  formId?: string
  nextLabel?: string
  nextDisabled?: boolean
  nextLoading?: boolean
  backDisabled?: boolean
  onNext?: () => void
}

type FooterStateMap = Record<number, FooterState>

type StepperContextType = {
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  goToStep: (n: number) => void
  complete: () => void
  isCompleted: boolean
  resetFlow: () => void

  footerState: FooterStateMap
  setFooterState: (partial: FooterState) => void
}

const StepperContext = createContext<StepperContextType | null>(null)

export function useStepper() {
  const ctx = useContext(StepperContext)
  if (!ctx) throw new Error("useStepper must be used within <StepperProvider>")
  return ctx
}

export function StepperProvider({
  children,
  totalSteps,
  onCompleted,
}: {
  children: ReactNode
  totalSteps: number
  onCompleted?: () => void
}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isCompleted, setIsCompleted] = useState(false)
  const [footerState, setFooterStateMap] = useState<FooterStateMap>({})

  const nextStep = () => setCurrentStep((s) => Math.min(totalSteps, s + 1))
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1))
  const goToStep = (n: number) =>
    setCurrentStep(Math.min(totalSteps, Math.max(1, n)))
  const complete = () => {
    setIsCompleted(true)
    onCompleted?.()
  }
  const resetFlow = () => {
    setCurrentStep(1)
    setIsCompleted(false)
    setFooterStateMap({})
  }

  /** estável + short-circuit (evita loops) */
  const setFooterState = useCallback(
    (partial: FooterState) => {
      setFooterStateMap((prev) => {
        const cur = prev[currentStep] ?? {}
        const next = { ...cur, ...partial }

        // shallow compare
        let changed = false
        const keys = new Set([...Object.keys(cur), ...Object.keys(next)])
        // @ts-ignore
        for (const k of keys) {
          // @ts-ignore
          if (cur[k] !== next[k]) {
            changed = true
            break
          }
        }
        return changed ? { ...prev, [currentStep]: next } : prev
      })
    },
    [currentStep]
  )

  const value = useMemo<StepperContextType>(
    () => ({
      currentStep,
      totalSteps,
      nextStep,
      prevStep,
      goToStep,
      complete,
      isCompleted,
      resetFlow,
      footerState,
      setFooterState,
    }),
    [currentStep, totalSteps, isCompleted, footerState, setFooterState]
  )

  return (
    <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
  )
}
