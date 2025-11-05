// app/(locale)/(private)/institutions/[id]/manage/events/_components/DeleteConfirmModal.tsx
"use client"

import * as React from "react"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal"
import { Button } from "@/components/ui/button"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  onConfirm: () => void
}

export default function DeleteConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Excluir",
  onConfirm,
}: Props) {
  return (
    <Modal isOpen={open} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <p className="text-sm text-muted-foreground">
            {description ??
              "Confirma a exclusão deste item? Esta ação é irreversível."}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
