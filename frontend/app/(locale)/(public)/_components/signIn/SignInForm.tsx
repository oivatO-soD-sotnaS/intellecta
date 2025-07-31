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
import { Card, CardBody } from "@heroui/card"

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

  const validatePassword = (pw: string) => {
    const err: string[] = []

    if (pw.length < 5) err.push("A senha deve ter ao menos 5 caracteres.")
    if (!/[A-Z]/.test(pw))
      err.push("A senha deve incluir pelo menos 1 letra maiúscula.")
    if (!/[^a-zA-Z0-9]/.test(pw))
      err.push("A senha deve incluir pelo menos 1 símbolo.")

    return err
  }

  // revalida enquanto digita após primeira tentativa
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

    // validações locais
    const locErr: typeof errors = {}

    if (!email) locErr.email = "Digite seu email."
    const pwErr = validatePassword(password)

    if (pwErr.length) locErr.password = pwErr
    if (!isHuman) locErr.terms = "Marque que você é humano."

    if (Object.keys(locErr).length) {
      setErrors(locErr)

      return
    }

    // chama API
    setErrors({})
    setIsLoading(true)
    try {
      const res = await fetch("/api/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const payload = await res.json()

      if (!res.ok) {
        const msg =
          payload.error?.message ||
          payload.message ||
          "Erro desconhecido no login."

        setErrors({ api: msg })
      } else {
        router.push("/home") // pagina após login
      }
    } catch {
      setErrors({ api: "Falha na conexão. Tente novamente." })
    } finally {
      setIsLoading(false)
    }
  }

  const hasPwErr = tried && !!errors.password?.length

  return (
    <Card className="w-full max-w-md mx-auto rounded-lg shadow-xl">
      <CardBody className="bg-white dark:bg-gray-800 p-8 space-y-6">
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
              placeholder="Digite seu email"
              type="email"
              value={email}
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
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm w-full">
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
          >
            Entrar
          </PrimaryButton>
        </Form>

        <div className="text-xs text-center pt-6 tracking-wide">
          Não tem conta ainda?{" "}
          <Link className="text-indigo-600" href="/sign-up">
            Inscreva-se
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}
