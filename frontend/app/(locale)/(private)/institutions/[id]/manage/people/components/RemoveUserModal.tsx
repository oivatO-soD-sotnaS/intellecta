// app/(locale)/(private)/institutions/[id]/manage/people/_components/RemoveUserModal.tsx
"use client"

import { Button } from "@heroui/button"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal"
import * as React from "react"


type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  memberName?: string
  isLoading?: boolean
  onConfirm: () => Promise<void> | void
}

export default function RemoveUserModal({
  open,
  onOpenChange,
  memberName,
  isLoading,
  onConfirm,
}: Props) {
  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Remover membro</ModalHeader>
            <ModalBody>
              <p className="text-sm text-muted-foreground">
                Tem certeza que deseja remover{" "}
                <b>{memberName ?? "o usuário"}</b> da instituição? Esta ação não
                pode ser desfeita.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={isLoading}>
                Cancelar
              </Button>
              <Button
                color="danger"
                onPress={async () => {
                  await onConfirm()
                  onClose()
                }}
                isLoading={isLoading}
              >
                Remover
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
