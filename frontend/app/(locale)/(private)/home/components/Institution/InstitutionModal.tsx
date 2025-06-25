/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
// components/ui/InstitutionModal.tsx
"use client"

import React, { useState } from "react"
import { Card, CardBody } from "@heroui/card"
import { Form } from "@heroui/form"
import { Input } from "@heroui/input"
import { Button } from "@heroui/button"
import { addToast } from "@heroui/toast"

interface InstitutionModalProps {
  onClose: () => void
  onCreate: (data: {
    name: string
    email: string
    phone?: string
    description: string
  }) => Promise<void> | void
}

export const InstitutionModal: React.FC<InstitutionModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [description, setDescription] = useState("")

  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    description?: string
  }>({})

  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const e: typeof errors = {}

    if (!name.trim()) e.name = "Preencha o nome da instituição."
    if (!email.trim()) e.email = "Preencha o e-mail da instituição."
    else if (!/^[^@]+@[^.]+\..+$/.test(email)) e.email = "E-mail inválido."
    if (!description.trim()) e.description = "Preencha a descrição."
    setErrors(e)

    return Object.keys(e).length === 0
  }

  const handleSubmit = async (data: any) => {
    // o Form do HeroUI já evita o default
    if (!validate()) return

    setIsLoading(true)
    try {
      await onCreate({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        description: description.trim(),
      })
      addToast({ title: "Instituição criada!", color: "success" })
      onClose()
    } catch (err: any) {
      addToast({
        title: "Erro ao criar",
        description: err.message || "Tente novamente.",
        color: "danger",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardBody className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Criar Nova Instituição</h3>
            <button
              aria-label="Fechar"
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <Form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              isRequired
              label="Nome da Instituição"
              placeholder="Digite o nome"
              value={name}
              variant="bordered"
              onValueChange={setName}
            />

            <Input
              isRequired
              label="Email da Instituição"
              placeholder="email@exemplo.com"
              type="email"
              value={email}
              variant="bordered"
              onValueChange={setEmail}
            />

            <Input
              label="Telefone (Opcional)"
              placeholder="(41) 99999-0000"
              type="tel"
              value={phone}
              variant="bordered"
              onValueChange={setPhone}
            />

            <label className="text-base font-medium text-gray-700 dark:text-gray-200 pb-2 block">
              Descrição <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`
                  w-full h-24 px-4 py-2
                  bg-gray-50 dark:bg-gray-700
                  border ${errors.description ? "border-danger" : "border-gray-300"} 
                  rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                  transition-colors
                  text-base placeholder-gray-400 dark:placeholder-gray-500
                `}
              placeholder="Descreva brevemente esta instituição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                isDisabled={isLoading}
                variant="bordered"
                onPress={onClose}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                isDisabled={isLoading}
                isLoading={isLoading}
                type="submit"
              >
                + Criar Instituição
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  )
}
