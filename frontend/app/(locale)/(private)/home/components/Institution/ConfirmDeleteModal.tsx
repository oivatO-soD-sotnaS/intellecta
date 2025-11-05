// app/(locale)/(private)/institutions/[id]/manage/institution/components/ConfirmDeleteModal.tsx
"use client"

import * as React from "react"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal"
import { Button } from "@heroui/button"
import { addToast } from "@heroui/toast"
import { useDeleteInstitution } from "@/hooks/institution/useDeleteInstitution"

type Props = {
  institutionId: string
  name: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
  // Novas props opcionais para compatibilidade
  onConfirm?: () => void | Promise<void>
  onDelete?: () => void | Promise<void>
  onSubmit?: () => void | Promise<void>
}

function toMessage(err: unknown) {
  if (typeof err === "string") return err
  if (err instanceof Error && err.message) return err.message
  const any = err as any
  if (typeof any?.data === "object" && any.data?.error)
    return String(any.data.error)
  if (any?.message) return String(any.message)
  return "Ocorreu um erro. Tente novamente."
}

export function ConfirmDeleteModal({
  institutionId,
  name,
  isOpen,
  onOpenChange,
  onDeleted,
  // Novas props
  onConfirm,
  onDelete,
  onSubmit,
}: Props) {
  const { mutateAsync, isPending } = useDeleteInstitution(institutionId)

  const handleDelete = async () => {
    try {
      await mutateAsync()
      addToast({
        title: "Instituição excluída",
        description: `"${name}" foi removida com sucesso.`,
        color: "success",
        variant: "flat",
      })

      // Executar callback apropriado (ordem de preferência)
      if (onConfirm) {
        await onConfirm()
      } else if (onDelete) {
        await onDelete()
      } else if (onSubmit) {
        await onSubmit()
      } else {
        onDeleted?.()
      }

      onOpenChange(false)
    } catch (e) {
      addToast({
        title: "Não foi possível excluir",
        description: toMessage(e),
        color: "danger",
        variant: "flat",
      })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{ base: "border border-border bg-card text-foreground" }}
    >
      <ModalContent>
        <ModalHeader className="text-base font-semibold">
          Deletar instituição
        </ModalHeader>
        <ModalBody>
          <p className="text-sm">
            Você tem certeza que quer deletar a instituição{" "}
            <span className="font-medium">"{name}"</span>? Essa ação não poderá
            ser desfeita.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="flat"
            onPress={() => onOpenChange(false)}
            isDisabled={isPending}
          >
            Cancelar
          </Button>
          <Button color="danger" onPress={handleDelete} isLoading={isPending}>
            Deletar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
