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

// seu componente de upload (mesmo usado em outros fluxos)
import FileUpload, { type FileUploadHandle } from "@/components/comp-547"

// hook que você anexou: usa o proxy /api/files/upload-profile-assets
import {
  UploadProfileAssetResponse,
  useUploadProfileAsset,
} from "@/hooks/files/useUploadProfileAsset"

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  institutionId: string
  onCreated?: () => void
}

export function ClassModal({
  isOpen,
  onOpenChange,
  institutionId,
  onCreated,
}: Props) {

    const { mutateAsync: createClass, isPending: isCreating } =
      useCreateClass(institutionId)


  // hook de upload (já existente no seu projeto)
  const { mutateAsync: uploadAsset, isPending: isUploading } =
    useUploadProfileAsset()
  // Se seu hook tiver outro nome, troque a linha acima; ex:
  // const { uploadAsync: uploadAsset, isPending: isUploading } = useUploadProfileAsset();

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

  const getRawFile = (ref: React.RefObject<any>): File | null => {
    try {
      const raw = ref.current?.getRawFiles?.()
      return Array.isArray(raw) ? (raw[0] ?? null) : null
    } catch {
      return null
    }
  }

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

    try {
      const profileFile = getRawFile(profileRef)
      const bannerFile = getRawFile(bannerRef)

      await createClass({
        name: name.trim(),
        description: description.trim(),
        profileFile,
        bannerFile,
      })

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
    createClass,
    onOpenChange,
    onCreated,
    resetForm,
  ])

  const isBusy = isCreating || isUploading

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
                isDisabled={isBusy}
              >
                Cancelar
              </Button>
              <Button color="primary" isLoading={isBusy} onPress={handleSubmit}>
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
