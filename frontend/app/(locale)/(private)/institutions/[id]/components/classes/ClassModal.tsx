"use client"

import * as React from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal"
import { Button } from "@heroui/button"
import { Input, Textarea } from "@heroui/input"
import { addToast } from "@heroui/toast"
import { useCreateClass } from "@/hooks/classes/useCreateClass"
import type { CreateClassInput } from "@/types/class"

// ajuste para o seu componente de upload real
import FileUpload, { type FileUploadHandle } from "@/components/comp-547"

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  institutionId: string
  onCreated?: () => void
}

function tryGetUploadedFileId(
  ref: React.RefObject<FileUploadHandle | any>
): string | null {
  const inst = ref.current
  if (!inst) return null
  try {
    if (typeof inst.getUploaded === "function") {
      const up = inst.getUploaded()
      if (Array.isArray(up)) return up[0]?.file_id ?? null
      return up?.file_id ?? null
    }
    if (typeof inst.getUploadedFiles === "function") {
      const arr = inst.getUploadedFiles()
      return (Array.isArray(arr) ? arr[0]?.file_id : null) ?? null
    }
    return null
  } catch {
    return null
  }
}

export function ClassModal({
  isOpen,
  onOpenChange,
  institutionId,
  onCreated,
}: Props) {
  const { mutateAsync, isPending } = useCreateClass(institutionId)

  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")

  const profileRef = React.useRef<FileUploadHandle | any>(null)
  const bannerRef = React.useRef<FileUploadHandle | any>(null)

  const resetForm = React.useCallback(() => {
    setName("")
    setDescription("")
    try {
      profileRef.current?.clear?.()
    } catch {}
    try {
      bannerRef.current?.clear?.()
    } catch {}
  }, [])

  const handleSubmit = React.useCallback(async () => {
    if (!name.trim() || !description.trim()) {
      addToast({
        title: "Campos obrigatórios",
        description: "Informe o nome e a descrição da turma.",
        color: "warning",
        variant: "flat",
      })
      return
    }

    const profileId = tryGetUploadedFileId(profileRef)
    const bannerId = tryGetUploadedFileId(bannerRef)

    const payload: CreateClassInput = {
      name: name.trim(),
      description: description.trim(),
      profile_picture_id: profileId ?? undefined,
      banner_id: bannerId ?? undefined,
      institution_id: institutionId,
    }

    try {
      await mutateAsync(payload)
      addToast({
        title: "Turma criada",
        description: "A turma foi criada com sucesso.",
        color: "success",
        variant: "flat",
      })
      resetForm()
      onOpenChange(false)
      onCreated?.()
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Não foi possível criar a turma. Tente novamente."
      addToast({
        title: "Erro ao criar turma",
        description: msg,
        color: "danger",
        variant: "flat",
      })
    }
  }, [
    name,
    description,
    institutionId,
    mutateAsync,
    onOpenChange,
    onCreated,
    resetForm,
  ])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      placement="center"
      size="lg"
    >
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Criar turma
            </ModalHeader>

            <ModalBody className="space-y-4">
              <Input
                label="Nome da turma"
                placeholder="Ex.: 3º Ano - Informática"
                value={name}
                onValueChange={setName}
                isRequired
                variant="bordered"
                size="sm"
                classNames={{ inputWrapper: "bg-background border-border" }}
              />

              <Textarea
                label="Descrição"
                placeholder="Breve descrição da turma…"
                value={description}
                onValueChange={setDescription}
                isRequired
                minRows={3}
                variant="bordered"
                size="sm"
                classNames={{ inputWrapper: "bg-background border-border" }}
              />

              <div>
                <div className="mb-1 text-sm font-medium">
                  Foto de perfil (opcional)
                </div>
                <FileUpload
                  ref={profileRef}
                  accept="image/*"
                  multiple={false}
                  maxFiles={1}
                  maxSizeMB={5}
                  description="PNG, JPG até 5MB"
                  dropzoneLabel="Selecionar imagem"
                />
              </div>

              <div>
                <div className="mb-1 text-sm font-medium">
                  Banner (opcional)
                </div>
                <FileUpload
                  ref={bannerRef}
                  accept="image/*"
                  multiple={false}
                  maxFiles={1}
                  maxSizeMB={5}
                  description="PNG, JPG até 5MB"
                  dropzoneLabel="Selecionar imagem"
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onPress={() => {
                  resetForm()
                  close()
                }}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                isLoading={isPending}
                onPress={handleSubmit}
              >
                Salvar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ClassModal
