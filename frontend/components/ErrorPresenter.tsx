// components/ErrorPresenter.tsx
"use client"
import { useEffect } from "react"
import { toast } from "sonner" // ou seu sistema de toasts
import type { AppError } from "@/lib/http-errors"

export function presentErrorToast(err: AppError) {
  const title = err.message || "Erro"
  const desc =
    err.detail ||
    err.problem?.detail ||
    (err.status ? `Código ${err.status}` : "Tente novamente mais tarde.")
  toast.error(title, { description: desc })
}

// Se quiser um componente 'headless' para ficar no layout:
export function ErrorToasterBridge({ error }: { error?: AppError }) {
  useEffect(() => {
    if (error) presentErrorToast(error)
  }, [error])
  return null
}
