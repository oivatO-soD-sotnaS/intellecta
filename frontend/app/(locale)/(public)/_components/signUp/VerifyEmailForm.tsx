"use client"

import React, { useCallback, useEffect, useRef } from "react"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardBody } from "@heroui/card"
import { InputOtp } from "@heroui/input-otp"
import { addToast } from "@heroui/toast"
import { useVerifyEmail } from "@/hooks/auth/useVerifyEmail"

const schema = z.object({
  code: z
    .string()
    .min(6, "Digite o código de 6 dígitos.")
    .max(6, "O código deve ter 6 dígitos.")
    .regex(/^\d{6}$/, "Use apenas números (6 dígitos)."),
})
type VerifyForm = z.infer<typeof schema>

interface VerifyEmailFormProps {
  email: string
  /** ESTE componente cria o <form> com este id */
  formId: string
  onVerified: () => void

  // feedback para o Stepper
  onFormStateChange?: (s: { isPending: boolean }) => void
  onValidityChange?: (valid: boolean) => void

  /** entrega ao pai um gatilho ESTÁVEL de submit */
  exposeStableSubmit?: (fn: () => void) => void
}

export const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({
  email,
  formId,
  onVerified,
  onFormStateChange,
  onValidityChange,
  exposeStableSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<VerifyForm>({
    resolver: zodResolver(schema),
    defaultValues: { code: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const mutation = useVerifyEmail(
    () => {
      addToast({
        title: "E-mail confirmado!",
        description: "Vamos continuar.",
        color: "success",
      })
      onVerified()
    },
    (msg) => addToast({ title: "Erro", description: msg, color: "danger" })
  )

  // pending → footer loading
  useEffect(() => {
    onFormStateChange?.({ isPending: mutation.isPending })
  }, [mutation.isPending, onFormStateChange])

  // validade → footer disabled/enabled
  useEffect(() => {
    onValidityChange?.(isValid)
  }, [isValid, onValidityChange])

  const onSubmit = useCallback(
    ({ code }: VerifyForm) => {
      if (!email) {
        addToast({
          title: "E-mail ausente",
          description: "Refaça o cadastro para obter um e-mail válido.",
          color: "warning",
        })
        return
      }
      if (mutation.isPending) return
      mutation.mutate({ email, verification_code: code })
    },
    [email, mutation]
  )

  // gatilho estável de submit (não muda a cada render)
  const submitRef = useRef<(() => void) | null>(null)
  useEffect(() => {
    submitRef.current = handleSubmit(onSubmit)
  }, [handleSubmit, onSubmit])

  const stableTrigger = React.useCallback(() => {
    submitRef.current?.()
  }, [])

  useEffect(() => {
    exposeStableSubmit?.(stableTrigger)
  }, [exposeStableSubmit, stableTrigger])

  return (
    <Card className="w-full max-w-md mx-auto rounded-lg shadow-xl">
      <CardBody className="bg-white dark:bg-gray-800 p-8 space-y-6">
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            stableTrigger()
          }}
          className="space-y-5"
        >
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold">Confirme seu e-mail</h2>
            <p className="text-sm text-gray-500">
              Enviamos um código de 6 dígitos para{" "}
              <span className="font-medium">{email}</span>.
            </p>
          </div>

          <Controller
            name="code"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col items-center gap-2">
                <InputOtp
                  length={6}
                  value={field.value}
                  onValueChange={(v) => field.onChange(v)}
                  onBlur={field.onBlur}
                  aria-label="Código de verificação"
                />
                {fieldState.error && (
                  <div className="text-xs text-red-600">
                    {fieldState.error.message}
                  </div>
                )}
              </div>
            )}
          />

          {/* Enter submit */}
          <button type="submit" className="hidden" aria-hidden />
        </form>
      </CardBody>
    </Card>
  )
}
