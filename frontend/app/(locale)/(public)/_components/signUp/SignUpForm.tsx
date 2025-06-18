// components/ui/sign-up/SignUpForm.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Card, CardBody } from "@heroui/card"
import { Form } from "@heroui/form"
import Link from "next/link"
import { addToast } from "@heroui/toast"

import { InputField } from "../InputField"
import { PasswordInput } from "../PasswordInput"
import { RecaptchaCheckbox } from "../RecaptchaCheckbox"
import { PrimaryButton } from "../PrimaryButton"

import { VerifyEmailModal } from "./VerifyEmailModal"

export const SignUpForm: React.FC = () => {

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isHuman, setIsHuman] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    api?: string
    fullName?: string
    email?: string
    password?: string[]
    terms?: string
  }>({})

  const [tried, setTried] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const validatePassword = (pw: string) => {
    const err: string[] = []

    if (pw.length < 8) err.push("A senha deve ter ao menos 8 caracteres.")
    if (!/[A-Z]/.test(pw))
      err.push("A senha deve incluir pelo menos 1 letra maiúscula.")
    if (!/[a-z]/.test(pw))
      err.push("A senha deve incluir pelo menos 1 letra minúscula.")
    if (!/[0-9]/.test(pw)) err.push("A senha deve incluir pelo menos 1 número.")
    if (!/[^a-zA-Z0-9]/.test(pw))
      err.push("A senha deve incluir pelo menos 1 símbolo.")

    return err
  }

  useEffect(() => {
    if (!tried) return
    setErrors((prev) => {
      const next = { ...prev }

      if (fullName.trim().length < 5)
        next.fullName = "O nome deve ter entre 5 e 64 caracteres."
      else delete next.fullName
      const pwErr = validatePassword(password)

      if (pwErr.length) next.password = pwErr
      else delete next.password

      return next
    })
  }, [fullName, password, tried])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    const locErr: typeof errors = {}

    if (fullName.trim().length < 5)
      locErr.fullName = "O nome deve ter entre 5 e 64 caracteres."
    if (!email) locErr.email = "Digite seu email."
    if (!/^[^@]+@[^.]+\..+$/.test(email))
      locErr.email = "Digite um e-mail válido."
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
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
        }),
      })
      const payload = await res.json()

      if (!res.ok) {
        const msg =
          payload.error?.message ||
          payload.message ||
          "Erro desconhecido no cadastro."

        setErrors({ api: msg })
      } else {
        addToast({
          title: "Conta criada!",
          description: "Verifique seu e-mail para continuar.",
          color: "success",
        })
        setShowModal(true)
      }
    } catch {
      setErrors({ api: "Falha na conexão. Tente novamente." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto rounded-lg shadow-xl">
        <CardBody className="bg-white dark:bg-gray-800 p-8 space-y-6">
          <Form className="space-y-5" onSubmit={handleSubmit}>
            {errors.api && (
              <div className="text-sm text-red-600">{errors.api}</div>
            )}
            <div className="flex flex-col gap-6 w-full">
              <InputField
                isRequired
                errorMessage={errors.fullName}
                isInvalid={!!errors.fullName}
                label="Nome completo"
                name="full_name"
                placeholder="Digite seu nome completo"
                value={fullName}
                onChange={setFullName}
              />
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
                  errors.password && (
                    <ul className="list-disc list-inside text-xs text-red-600 space-y-1">
                      {errors.password.map((msg, i) => (
                        <li key={i}>{msg}</li>
                      ))}
                    </ul>
                  )
                }
                isInvalid={!!errors.password}
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
                isLoading ||
                !fullName ||
                !email ||
                !password ||
                !isHuman ||
                !!errors.fullName ||
                !!errors.email ||
                !!errors.password
              }
              isLoading={isLoading}
              type="submit"
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
      {showModal && (
        <VerifyEmailModal
          email={email.trim()}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
