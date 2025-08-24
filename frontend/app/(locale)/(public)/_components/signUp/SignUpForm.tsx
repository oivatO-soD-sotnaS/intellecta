"use client"

import React, { useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardBody } from "@heroui/card"
import { addToast } from "@heroui/toast"

import { InputField } from "../InputField"
import { PasswordInput } from "../PasswordInput"
import { RecaptchaCheckbox } from "../RecaptchaCheckbox"

import { signUpFormSchema, type SignUpFormData } from "./signUpForm.schema"
import { useSignUp } from "@/hooks/auth/useSignUp"

interface SignUpFormProps {
  fullName: string
  onSuccess: (email: string) => void
  formId: string

  onFormStateChange?: (s: { isPending: boolean }) => void
  onValidityChange?: (valid: boolean) => void

  /** entrega ao pai um gatilho ESTÁVEL de submit */
  exposeStableSubmit?: (fn: () => void) => void
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  fullName,
  onSuccess,
  formId,
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
        description: "Verifique seu e-mail para continuar.",
        color: "success",
      })
      onSuccess(email)
    },
    (msg) =>
      addToast({
        title: "Erro",
        description: msg,
        color: "danger",
      })
  )

  useEffect(() => {
    onFormStateChange?.({ isPending: mutation.isPending })
  }, [mutation.isPending, onFormStateChange])

  useEffect(() => {
    onValidityChange?.(isValid)
  }, [isValid, onValidityChange])

  // envia full_name junto no payload (evita 422)
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

      mutation.mutate({ email, password, isHuman, full_name } as any)
    },
    [mutation, fullName]
  )

  // gatilho estável via ref (não muda referência a cada render)
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
    <Card className="w-full max-w-md mx-auto rounded-2xl shadow-xl">
      <CardBody className="bg-white dark:bg-gray-800 p-8 space-y-6">
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            stableTrigger()
          }}
          className="space-y-5"
        >
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

          <div className="text-xs text-center pt-6 tracking-wide">
            Já tem conta?{" "}
            <Link className="text-indigo-600" href="/sign-in">
              Entrar
            </Link>
          </div>

          {/* Enter submit */}
          <button type="submit" className="hidden" aria-hidden />
        </form>
      </CardBody>
    </Card>
  )
}
