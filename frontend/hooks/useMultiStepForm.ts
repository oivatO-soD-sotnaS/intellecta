import { useState } from "react"

export function useMultiStepForm(totalSteps: number, initial = 1) {
  const [current, setCurrent] = useState(initial)
  return {
    current,
    next: () => setCurrent((c) => Math.min(totalSteps, c + 1)),
    back: () => setCurrent((c) => Math.max(1, c - 1)),
    goTo: (n: number) => setCurrent(Math.min(totalSteps, Math.max(1, n))),
  }
}
