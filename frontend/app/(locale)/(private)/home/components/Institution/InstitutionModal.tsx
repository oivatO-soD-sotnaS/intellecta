// components/ui/InstitutionModal.tsx
"use client"

import React, { useState } from "react"
import { Form } from "@heroui/form"
import { Input, Textarea } from "@heroui/input"
import { Button } from "@heroui/button"
import { addToast } from "@heroui/toast"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal"
import { Card, CardContent } from "@/components/ui/card"

interface InstitutionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (data: {
    name: string
    email: string
    description: string
  }) => Promise<void> | void
}

export const InstitutionModal: React.FC<InstitutionModalProps> = ({
  isOpen,
  onOpenChange,
  onCreate,
}) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
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

  const handleSubmit = async () => {
    if (!validate()) return

    setIsLoading(true)
    try {
      await onCreate({
        name: name.trim(),
        email: email.trim(),
        description: description.trim(),
      })
      addToast({ title: "Instituição criada!", color: "success" })
      onOpenChange(false)
      // limpa formulário
      setName("")
      setEmail("")
      setDescription("")
      setErrors({})
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
    <Modal
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={(open) => onOpenChange(open)}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-semibold">
              Criar Nova Instituição
            </ModalHeader>

            <ModalBody>
              <Card>
                <CardContent className="p-0">
                  <Form
                    className="space-y-4 p-4"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSubmit()
                    }}
                  >
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

                    <Textarea
                      className={`
                        w-full h-24 px-4 py-2
                        bg-gray-50 dark:bg-gray-700
                        border ${errors.description ? "border-danger" : "border-gray-300"}
                        rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-indigo-400
                        transition-colors
                        text-base placeholder-gray-400 dark:placeholder-gray-500
                      `}
                      label="Descrição"
                      placeholder="Descreva brevemente esta instituição"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && (
                      <p className="text-sm text-danger">
                        {errors.description}
                      </p>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        isDisabled={isLoading}
                        variant="bordered"
                        onPress={() => {
                          onClose()
                          onOpenChange(false)
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        color="primary"
                        isLoading={isLoading}
                        type="submit"
                      >
                        + Criar Instituição
                      </Button>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </ModalBody>

            <ModalFooter />
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
