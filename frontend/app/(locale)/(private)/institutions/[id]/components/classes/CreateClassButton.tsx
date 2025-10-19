"use client"

import * as React from "react"
import { Button } from "@heroui/button"
import { Plus } from "lucide-react"
import { ClassModal } from "./ClassModal"
import { useDisclosure } from "@heroui/modal"

type Props = {
  institutionId: string
  onCreated?: () => void
  asIconOnly?: boolean
  className?: string
}

export function CreateClassButton({
  institutionId,
  onCreated,
  asIconOnly = false,
  className,
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Button
        color="primary"
        onPress={onOpen}
        className={className}
        startContent={!asIconOnly ? <Plus className="h-4 w-4" /> : undefined}
        isIconOnly={asIconOnly}
        aria-label="Criar turma"
      >
        {!asIconOnly ? "Criar turma" : <Plus className="h-4 w-4" />}
      </Button>

      <ClassModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        institutionId={institutionId}
        onCreated={onCreated}
      />
    </>
  )
}

export default CreateClassButton
