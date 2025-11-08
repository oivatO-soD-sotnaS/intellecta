// components/ui/SignInForm.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Form } from "@heroui/form"
import Link from "next/link"

import { InputField } from "../InputField"
import { PasswordInput } from "../PasswordInput"
import { RecaptchaCheckbox } from "../RecaptchaCheckbox"
import { PrimaryButton } from "../PrimaryButton"
import { Card, CardContent } from "@/components/ui/card"

import { assertOkOrThrow, friendlyMessage, HttpError } from "@/lib/http-errors"
import { useErrorFeedback } from "@/hooks/useErrorFeedback"
import { addToast } from "@heroui/toast"


type SignInValues = {
  email: string
  password: string
}


export const SignInForm: React.FC = () => {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isHuman, setIsHuman] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    api?: string
    email?: string
    password?: string[]
    terms?: string
  }>({})

  const [tried, setTried] = useState(false)

  const { notifyError, notifySuccess } = useErrorFeedback<SignInValues>()


  const validatePassword = (pw: string) => {
    const err: string[] = []

    if (pw.length < 5) err.push("A senha deve ter ao menos 5 caracteres.")
    if (!/[A-Z]/.test(pw))
      err.push("A senha deve incluir pelo menos 1 letra maiúscula.")
    if (!/[^a-zA-Z0-9]/.test(pw))
      err.push("A senha deve incluir pelo menos 1 símbolo.")

    return err
  }

  useEffect(() => {
    if (!tried) return
    const pwErr = validatePassword(password)

    setErrors((prev) => {
      const next = { ...prev }

      if (pwErr.length) next.password = pwErr
      else delete next.password

      return next
    })
  }, [password, tried])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTried(true)

    const locErr: typeof errors = {}

    if (!email) locErr.email = "Digite seu email."
    const pwErr = validatePassword(password)
    if (pwErr.length) locErr.password = pwErr
    if (!isHuman) locErr.terms = "Marque que você é humano."

    if (Object.keys(locErr).length) {
      setErrors(locErr)
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      const res = await fetch("/api/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      await assertOkOrThrow(res)

      router.push("/home")
    } catch (err) {
      const { title, description } = friendlyMessage(err, "signin")

      addToast({ title, description, color: "danger", variant: "flat" })

      if (err instanceof HttpError && err.status === 422) {
        setErrors({ password: ["Senha incorreta."] })
      } else if (err instanceof HttpError && err.status >= 500) {
        setErrors({ api: "Erro no servidor. Tente novamente em instantes." })
      } else if (err instanceof TypeError) {
        setErrors({ api: "Falha na conexão. Tente novamente." })
      } else {
        setErrors({ api: title || "Não foi possível efetuar login." })
      }
    } finally {
      setIsLoading(false)
    }
  }


  const hasPwErr = tried && !!errors.password?.length

  return (
    <Card className="w-full max-w-md mx-auto rounded-lg shadow-xl border-none">
      <CardContent className=" 00 p-8 space-y-6">
        <Form className="space-y-5" onSubmit={handleSubmit}>
          {errors.api && (
            <div className="text-sm text-red-600">{errors.api}</div>
          )}

          <div className="flex flex-col gap-7 w-full">
            <InputField
              isRequired
              errorMessage={errors.email}
              isInvalid={!!errors.email}
              label="Email"
              name="email"
              type="email"
              value={email}
              variant="bordered"
              onChange={setEmail}
            />
            <PasswordInput
              isRequired
              errorMessage={
                hasPwErr ? (
                  <ul className="list-disc list-inside text-xs text-red-600 space-y-1">
                    {errors.password!.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                ) : undefined
              }
              isInvalid={hasPwErr}
              name="password"
              value={password}
              onChange={setPassword}
              variant="bordered"
            />
          </div>

          <div className="p-4 rounded-lg w-full">
            <RecaptchaCheckbox isSelected={isHuman} onChange={setIsHuman} />
          </div>
          {errors.terms && (
            <span className="text-xs text-red-600">{errors.terms}</span>
          )}

          <PrimaryButton
            isDisabled={
              isLoading || !email || !password || !isHuman || hasPwErr
            }
            isLoading={isLoading}
            type="submit"
            className="bg-primary"
          >
            Entrar
          </PrimaryButton>
        </Form>

        <div className=" text-center pt-6 tracking-wide text-base">
          Não tem conta ainda?{" "}
          <Link className="text-primary  font-bold" href="/sign-up">
            Inscreva-se
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
