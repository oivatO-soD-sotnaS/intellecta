"use client"

import React, { useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addToast } from "@heroui/toast"

import { InputField } from "../InputField"
import { PasswordInput } from "../PasswordInput"
import { RecaptchaCheckbox } from "../RecaptchaCheckbox"

import { signUpFormSchema, type SignUpFormData } from "./signUpForm.schema"
import { useSignUp } from "@/hooks/auth/useSignUp"

interface SignUpFormProps {
  fullName: string
  formId: string
  onSuccess: (
    email: string,
    payload: {
      full_name: string
      email: string
      password: string
      isHuman: boolean
    }
  ) => void
  onFormStateChange?: (s: { isPending: boolean }) => void
  onValidityChange?: (valid: boolean) => void
  exposeStableSubmit?: (fn: () => void) => void
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  fullName,
  formId,
  onSuccess,
  onFormStateChange,
  onValidityChange,
  exposeStableSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { email: "", password: "", isHuman: false },
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const mutation = useSignUp(
    (email) => {
      addToast({
        title: "Conta criada!",
        description: "Enviamos um código de verificação para o seu e-mail.",
        color: "success",
      })
      // entrega também o payload para Step2 salvar e Step3 poder “Reenviar”
      onSuccess(email, lastSubmitRef.current!)
    },
    (msg) => addToast({ title: "Erro", description: msg, color: "danger" })
  )

  useEffect(() => {
    onFormStateChange?.({ isPending: mutation.isPending })
  }, [mutation.isPending, onFormStateChange])

  useEffect(() => {
    onValidityChange?.(isValid)
  }, [isValid, onValidityChange])

  const lastSubmitRef = useRef<{
    full_name: string
    email: string
    password: string
    isHuman: boolean
  } | null>(null)

  const onSubmit = useCallback(
    ({ email, password, isHuman }: SignUpFormData) => {
      if (mutation.isPending) return

      const full_name = (fullName ?? "").trim()
      if (!full_name) {
        addToast({
          title: "Nome obrigatório",
          description: "Volte ao passo 1 e informe seu nome completo.",
          color: "warning",
        })
        return
      }

      const payload = { email, password, isHuman, full_name }
      lastSubmitRef.current = payload
      mutation.mutate(payload as any)
    },
    [mutation, fullName]
  )

  // gatilho estável
  const submitRef = useRef<(() => void) | null>(null)
  useEffect(() => {
    submitRef.current = handleSubmit(onSubmit)
  }, [handleSubmit, onSubmit])

  const stableTrigger = React.useCallback(() => submitRef.current?.(), [])
  useEffect(() => {
    exposeStableSubmit?.(stableTrigger)
  }, [exposeStableSubmit, stableTrigger])

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault()
        stableTrigger()
      }}
      className="space-y-5"
    >
      <div className="flex gap-5 flex-col">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <InputField
              name={field.name}
              label="Digite seu E-mail:"
              type="email"
              placeholder=""
              value={field.value}
              onChange={(v) => field.onChange(v)}
              onBlur={field.onBlur}
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
              variant="underlined"
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <PasswordInput
              name={field.name}
              label="Crie uma senha:"
              placeholder=""
              value={field.value}
              onChange={(v) => field.onChange(v)}
              onBlur={field.onBlur}
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
              variant="underlined"
            />
          )}
        />

        <Controller
          name="isHuman"
          control={control}
          render={({ field, fieldState }) => (
            <RecaptchaCheckbox
              name={field.name}
              checked={field.value}
              onChange={field.onChange}
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
            />
          )}
        />
      </div>

      <div className="text-xs text-center pt-6 tracking-wide text-muted-foreground">
        Já tem conta?{" "}
        <Link
          className="text-primary underline underline-offset-4"
          href="/sign-in"
        >
          Entrar
        </Link>
      </div>

      <button type="submit" className="hidden" aria-hidden />
    </form>
  )
}
