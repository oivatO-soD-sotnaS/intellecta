// app/(locale)/(private)/institutions/[id]/components/classes/ClassEditClassModal.tsx
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

import type { ClassDTO } from "@/types/class"
import { useUploadProfileAsset } from "@/hooks/files/useUploadProfileAsset"
import { useUpdateClass } from "@/hooks/classes/mutations"
import FileUpload, { type FileUploadHandle } from "@/components/comp-547"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  institutionId: string
  klass: ClassDTO | null
  onSaved?: () => void
}

export default function ClassEditClassModal({
  open,
  onOpenChange,
  institutionId,
  klass,
  onSaved,
}: Props) {
  // ---------- STATE ----------
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")

  // refs para os componentes FileUpload
  const profileRef = React.useRef<FileUploadHandle | any>(null)
  const bannerRef = React.useRef<FileUploadHandle | any>(null)

  // hooks
  const { mutateAsync: uploadAsset, isPending: uploading } =
    useUploadProfileAsset()
  const { mutateAsync: updateClass, isPending: saving } =
    useUpdateClass(institutionId)

  // ---------- EFFECT: carregar dados atuais quando abrir ----------
  React.useEffect(() => {
    if (!open || !klass) return

    setName(klass.name ?? "")
    setDescription(klass.description ?? "")

    // Limpa os FileUploads quando abrir
    try {
      profileRef.current?.clear?.()
    } catch {}
    try {
      bannerRef.current?.clear?.()
    } catch {}
  }, [open, klass])

  // ---------- HELPERS ----------
  const getRawFile = (ref: React.RefObject<any>): File | null => {
    try {
      const raw = ref.current?.getRawFiles?.()
      return Array.isArray(raw) ? (raw[0] ?? null) : null
    } catch {
      return null
    }
  }

  // ---------- SAVE ----------
  async function handleSave() {
    if (!klass) return

    try {
      let profile_picture_id: string | undefined
      let banner_id: string | undefined

      const profileFile = getRawFile(profileRef)
      const bannerFile = getRawFile(bannerRef)

      // Sobe arquivos novos, se selecionados
      if (profileFile) {
        const up = await uploadAsset(profileFile)
        profile_picture_id = up.file_id
      }
      if (bannerFile) {
        const up = await uploadAsset(bannerFile)
        banner_id = up.file_id
      }

      await updateClass({
        classId: klass.class_id,
        payload: {
          name: name.trim(),
          description: description.trim(),
          profile_picture_id,
          banner_id,
        },
      })

      addToast({
        title: "Turma atualizada",
        description: "As alterações foram salvas.",
        color: "success",
        variant: "flat",
      })

      onOpenChange(false)
      onSaved?.()
    } catch (err: any) {
      addToast({
        title: "Erro ao salvar",
        description: err?.data?.message || err?.message || "Tente novamente.",
        color: "danger",
        variant: "flat",
      })
    }
  }

  const isBusy = saving || uploading

  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      backdrop="blur"
      placement="center"
      size="lg"
    >
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Editar turma
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
                  close()
                }}
                isDisabled={isBusy}
              >
                Cancelar
              </Button>
              <Button color="primary" onPress={handleSave} isLoading={isBusy}>
                Salvar alterações
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
