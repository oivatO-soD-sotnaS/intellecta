"use client"

import React, { useCallback, useEffect, useRef } from "react"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputOtp } from "@heroui/input-otp"
import { addToast } from "@heroui/toast"
import { useMutation } from "@tanstack/react-query"
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
  formId: string
  onVerified: () => void

  /** opcional: se fornecer, usamos esse handler para reenviar */
  onResend?: () => void

  onFormStateChange?: (s: { isPending: boolean }) => void
  onValidityChange?: (valid: boolean) => void

  /** entrega um submit estável para o Stepper acionar */
  exposeStableSubmit?: (fn: () => void) => void
}

export const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({
  email,
  formId,
  onVerified,
  onFormStateChange,
  onValidityChange,
  exposeStableSubmit,
  onResend,
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

  // --- Submissão do código (verificação) ---
  const verifyMutation = useVerifyEmail(
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

  // --- Reenvio do código ---
  // Estratégia:
  // 1) Se onResend existir, usamos ela.
  // 2) Senão, tentamos refazer o cadastro com o payload salvo no sessionStorage.
  type LastPayload = {
    full_name: string
    email: string
    password: string
    isHuman: boolean
  }

  const resendMutation = useMutation({
    mutationFn: async () => {
      if (!email) throw new Error("E-mail ausente")

      // a) handler externo
      if (onResend) {
        await Promise.resolve(onResend())
        return { ok: true }
      }

      // b) fallback: refazer cadastro (reenvia o e-mail)
      const raw = sessionStorage.getItem("signup:last-payload")
      if (!raw) {
        throw new Error(
          "Dados do cadastro indisponíveis. Volte ao passo anterior e faça o cadastro novamente."
        )
      }
      const payload = JSON.parse(raw) as LastPayload
      if (!payload?.email || !payload?.password || !payload?.full_name) {
        throw new Error(
          "Payload inválido. Volte ao passo anterior e faça o cadastro novamente."
        )
      }

      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const msg =
          data?.error?.message || `Falha ao reenviar o código (${res.status}).`
        throw new Error(msg)
      }
      return res.json().catch(() => ({}))
    },
    onSuccess: () => {
      addToast({
        title: "Código reenviado",
        description: "Verifique sua caixa de entrada (e spam).",
        color: "success",
      })
      setCooldown(60)
    },
    onError: (err: any) => {
      addToast({
        title: "Não foi possível reenviar",
        description: String(err?.message || err),
        color: "danger",
      })
    },
  })

  // pendência global do form (verificar + reenviar)
  useEffect(() => {
    onFormStateChange?.({
      isPending: verifyMutation.isPending || resendMutation.isPending,
    })
  }, [verifyMutation.isPending, resendMutation.isPending, onFormStateChange])

  // emite validade
  useEffect(() => {
    onValidityChange?.(isValid)
  }, [isValid, onValidityChange])

  const onSubmit = useCallback(
    ({ code }: VerifyForm) => {
      if (!email) {
        addToast({
          title: "E-mail ausente",
          description:
            "Refaça o cadastro para obter um e-mail válido antes de verificar.",
          color: "warning",
        })
        return
      }
      if (verifyMutation.isPending) return
      verifyMutation.mutate({ email, verification_code: code })
    },
    [email, verifyMutation]
  )

  // --- Gatilho estável para o Stepper ---
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

  // cooldown do reenvio
  const [cooldown, setCooldown] = React.useState(0)
  useEffect(() => {
    if (cooldown <= 0) return
    const id = setInterval(() => setCooldown((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [cooldown])

  const canResend = !!email && cooldown <= 0 && !resendMutation.isPending

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault()
        stableTrigger()
      }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold">Confirme seu e-mail</h2>
        <p className="text-sm text-muted-foreground">
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
              size="lg"
              value={field.value}
              onValueChange={(v) => field.onChange(v)}
              onBlur={field.onBlur}
              aria-label="Código de verificação"
            />
            {fieldState.error && (
              <div className="text-xs text-destructive">
                {fieldState.error.message}
              </div>
            )}
          </div>
        )}
      />

      {/* Reenvio */}
      <div className="text-center text-xs text-muted-foreground">
        Não recebeu o código?{" "}
        <button
          type="button"
          onClick={() => canResend && resendMutation.mutate()}
          disabled={!canResend}
          className="text-primary underline underline-offset-4 disabled:opacity-50 cursor-pointer"
          aria-live="polite"
        >
          {resendMutation.isPending
            ? "Reenviando..."
            : cooldown > 0
              ? `Reenviar em ${cooldown}s`
              : "Reenviar código"}
        </button>
      </div>

      {/* Enter submit */}
      <button type="submit" className="hidden" aria-hidden />
    </form>
  )
}
