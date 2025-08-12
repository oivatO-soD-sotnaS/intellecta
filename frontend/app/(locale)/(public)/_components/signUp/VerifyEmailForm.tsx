// app/(locale)/(public)/_components/signUp/VerifyEmailForm.tsx
"use client"

import React from "react"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardBody } from "@heroui/card"
import { Form } from "@heroui/form"
import { InputOtp } from "@heroui/input-otp"
import { PrimaryButton } from "../PrimaryButton"
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
  onVerified: () => void // avança o Stepper
}

export const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({
  email,
  onVerified,
}) => {
  const { control, handleSubmit, formState } = useForm<VerifyForm>({
    resolver: zodResolver(schema),
    defaultValues: { code: "" },
    mode: "onChange",
  })

  const mutation = useVerifyEmail(
    () => {
      addToast({
        title: "Verificação concluída!",
        description: "Seu e-mail foi confirmado.",
        color: "success",
      })
      onVerified()
    },
    (msg) =>
      addToast({
        title: "Falha na verificação",
        description: msg,
        color: "danger",
      })
  )

  const onSubmit = (data: VerifyForm) => {
    if (!email) {
      addToast({
        title: "E-mail ausente",
        description: "Refaça o cadastro para obter um e-mail válido.",
        color: "warning",
      })
      return
    }
    // payload alinhado ao seu modal: verification_code
    mutation.mutate({ email, verification_code: data.code })
  }

  return (
    <Card className="w-full max-w-md mx-auto rounded-lg shadow-xl">
      <CardBody className="bg-white dark:bg-gray-800 p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold">Confirme seu e-mail</h2>
          <p className="text-sm text-gray-500">
            Enviamos um código de 6 dígitos para{" "}
            <span className="font-medium">{email}</span>.
          </p>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="code"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col items-center gap-2">
                <InputOtp
                  classNames={{
                    input:
                      "w-12 h-12 text-center text-lg " +
                      "bg-gray-50 dark:bg-gray-700 rounded-md " +
                      "focus:ring-2 focus:ring-indigo-400",
                  }}
                  length={6}
                  value={field.value ?? ""}
                  onValueChange={field.onChange} // string -> RHF
                  isDisabled={mutation.isPending}
                />
                {fieldState.error && (
                  <div className="text-xs text-red-600">
                    {fieldState.error.message}
                  </div>
                )}
              </div>
            )}
          />

          <PrimaryButton
            type="submit"
            isLoading={mutation.isPending}
            isDisabled={!formState.isValid || mutation.isPending}
          >
            Verificar
          </PrimaryButton>
        </Form>

        <p className="text-xs text-center text-gray-500">
          Não recebeu o código? Verifique o spam ou solicite reenvio.
        </p>
      </CardBody>
    </Card>
  )
}
