// components/ui/VerifyEmailModal.tsx
"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardBody } from "@heroui/card"
import { addToast } from "@heroui/toast"
import { InputOtp } from "@heroui/input-otp"

import { PrimaryButton } from "../PrimaryButton"

interface VerifyEmailModalProps {
  email: string
  onClose: () => void
}

export const VerifyEmailModal: React.FC<VerifyEmailModalProps> = ({
  email,
  onClose,
}) => {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()

  const handleVerify = async () => {
    setError(undefined)
    setIsLoading(true)
    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verification_code: code }),
      })
      const payload = await res.json()

      if (!res.ok) {
        const msg =
          payload.error?.message || payload.message || "Código inválido."

        setError(msg)
        addToast({
          title: "Falha na verificação",
          description: msg,
          color: "danger",
        })
      } else {
        addToast({
          title: "Conta verificada!",
          description: "Bem-vindo(a)!",
          color: "success",
        })
        router.push("/home")
      }
    } catch {
      setError("Erro de conexão.")
      addToast({
        title: "Erro",
        description: "Não foi possível verificar o código.",
        color: "danger",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-full max-w-sm">
        <CardBody className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Confirme seu e-mail</h2>
          <p className="text-sm text-gray-600">
            Digite o código que enviamos para <strong>{email}</strong>
          </p>

          {/* Usando classNames para estilizar o slot "input" */}
          <div className="flex justify-center">
            <InputOtp
              classNames={{
                input:
                  "w-12 h-12 text-center text-lg " +
                  "bg-gray-50 dark:bg-gray-700 rounded-md " +
                  "focus:ring-2 focus:ring-indigo-400",
              }}
              isDisabled={isLoading}
              length={6}
              value={code}
              onValueChange={setCode}
            />
          </div>

          {error && (
            <div className="text-xs text-red-600 text-center">{error}</div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm"
              disabled={isLoading}
              onClick={onClose}
            >
              Cancelar
            </button>
            <PrimaryButton
              isDisabled={!code || isLoading}
              isLoading={isLoading}
              onClick={handleVerify}
            >
              Verificar
            </PrimaryButton>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
