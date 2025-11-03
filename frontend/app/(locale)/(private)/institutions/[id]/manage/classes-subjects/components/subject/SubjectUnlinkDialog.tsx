// app/(locale)/(private)/institutions/[id]/manage/classes-subjects/_components/SubjectUnlinkDialog.tsx
"use client"

import * as React from "react"

import { useClassSubjects } from "@/hooks/class-subjects/useClassSubjects"
import { useRemoveSubjectFromClass } from "@/hooks/class-subjects/useRemoveSubjectFromClass"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal"
import { Button } from "@heroui/button"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  institutionId: string
  classId: string
  subjectId: string
  onUnlinked?: () => void
}

export default function SubjectUnlinkDialog({
  open,
  onOpenChange,
  institutionId,
  classId,
  subjectId,
  onUnlinked,
}: Props) {
  // Buscar relação turma–disciplina para obter o class_subjects_id
  const { data } = useClassSubjects(institutionId, classId)
  const relation = (data ?? []).find(
    (cs) => cs.subject.subject_id === subjectId
  )

  const removeMutation = useRemoveSubjectFromClass(institutionId, classId)

  const handleConfirm = async (onClose?: () => void) => {
    if (!relation?.class_subjects_id) return
    await removeMutation.mutateAsync(relation.class_subjects_id)
    onUnlinked?.()
    // Fechar o modal suavemente usando o onClose do ModalContent
    onClose?.()
    // Garantia extra caso o fechamento controlado seja necessário
    onOpenChange(false)
  }

  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      placement="center"
      size="md"
      backdrop="blur"
      className="rounded-2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-base sm:text-lg">
              Desvincular disciplina da turma?
            </ModalHeader>

            <ModalBody>
              <p className="text-sm text-muted-foreground">
                Esta ação <b>não</b> exclui a disciplina da instituição — apenas
                remove o vínculo com a turma atual.
              </p>
            </ModalBody>

            <ModalFooter className="gap-2">
              <Button
                variant="light"
                onPress={onClose}
                isDisabled={removeMutation.isPending}
              >
                Cancelar
              </Button>

              <Button
                color="danger"
                onPress={() => handleConfirm(onClose)}
                isDisabled={
                  removeMutation.isPending || !relation?.class_subjects_id
                }
                isLoading={removeMutation.isPending}
              >
                {removeMutation.isPending ? "Removendo..." : "Desvincular"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
