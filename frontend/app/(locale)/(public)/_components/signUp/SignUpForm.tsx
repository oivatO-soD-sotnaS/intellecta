// app/(locale)/(public)/_components/signUp/SignUpForm.tsx
"use client"

import React from "react"
import { signUpFormSchema, SignUpFormData } from "./signUpForm.schema"
import { useSignUp } from "@/hooks/auth/useSignUp"
import { Card, CardBody } from "@heroui/card"
import { Form } from "@heroui/form"
import Link from "next/link"
import { addToast } from "@heroui/toast"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputField } from "../InputField"
import { PasswordInput } from "../PasswordInput"
import { RecaptchaCheckbox } from "../RecaptchaCheckbox"
import { PrimaryButton } from "../PrimaryButton"

interface SignUpFormProps {
  onSuccess: (email: string) => void
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      isHuman: false,
    },
  })

  const { control } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onChange",
  })

  const isHuman = watch("isHuman")
  const mutation = useSignUp(
    (email) => {
      addToast({
        title: "Conta criada!",
        description: "Verifique seu e-mail para continuar.",
        color: "success",
      })
      onSuccess(email)
    },
    (msg) => {
      addToast({ title: "Erro", description: msg, color: "danger" })
    }
  )

  const onSubmit = (data: SignUpFormData) => {
    mutation.mutate(data)
  }

  return (
    <Card className="w-full max-w-md mx-auto rounded-lg shadow-xl">
      <CardBody className="bg-white dark:bg-gray-800 p-8 space-y-6">
        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Nome */}
          <Controller
            name="fullName"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputField
                name={field.name}
                label="Nome completo"
                placeholder="Digite seu nome completo"
                value={field.value ?? ""}
                onChange={field.onChange}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                isRequired
              />
            )}
          />

          {/* E-mail */}
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputField
                name={field.name}
                label="E-mail"
                placeholder="Digite seu e-mail"
                type="email"
                value={field.value ?? ""}
                onChange={field.onChange}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                isRequired
              />
            )}
          />

          {/* Senha */}

          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <PasswordInput
                name={field.name}
                label="Senha"
                value={field.value ?? ""}
                onChange={field.onChange}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                isRequired
              />
            )}
          />

          {/* Recaptcha */}
          <Controller
            name="isHuman"
            control={control}
            defaultValue={false}
            render={({ field, fieldState }) => (
              <>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                  <RecaptchaCheckbox
                    isSelected={!!field.value}
                    onChange={field.onChange}
                  />
                </div>
                {fieldState.error && (
                  <span className="text-xs text-red-600">
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
          {errors.isHuman && (
            <span className="text-xs text-red-600">
              {errors.isHuman.message}
            </span>
          )}

          {/* Botão */}
          <PrimaryButton
            type="submit"
            isLoading={mutation.isPending}
            isDisabled={!isValid || mutation.isPending}
          >
            Cadastrar
          </PrimaryButton>
        </Form>
        <div className="text-xs text-center pt-6 tracking-wide">
          Já tem conta?{" "}
          <Link className="text-indigo-600" href="/sign-in">
            Entrar
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}
