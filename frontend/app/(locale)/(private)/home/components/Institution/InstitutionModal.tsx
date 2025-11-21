"use client"

import * as React from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal"
import { Input } from "@heroui/input"
import { Button } from "@heroui/button"
import { addToast } from "@heroui/toast"

import FileUpload, { FileUploadHandle } from "@/components/comp-547"

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreate: () => void
}

export function InstitutionModal({ isOpen, onOpenChange, onCreate }: Props) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")

  const profileRef = React.useRef<FileUploadHandle>(null)
  const bannerRef = React.useRef<FileUploadHandle>(null)

  const [isPending, setIsPending] = React.useState(false)

  const resetForm = React.useCallback(() => {
    setName("")
    setDescription("")
    profileRef.current?.clear()
    bannerRef.current?.clear()
  }, [])

  // -----------------------
  // Submit
  // -----------------------

  const handleSubmit = React.useCallback(async () => {
    if (!name.trim() || !description.trim()) {
      addToast({
        title: "Preencha os campos obrigatórios",
        description: "Nome e descrição são obrigatórios.",
        color: "warning",
        variant: "flat",
      })

      return
    }

    const profileFile = profileRef.current?.getRawFiles()?.[0] ?? null
    const bannerFile = bannerRef.current?.getRawFiles()?.[0] ?? null

    setIsPending(true)
    try {
      const formData = new FormData()

      formData.append("name", name.trim())
      formData.append("description", description.trim())
      if (profileFile) formData.append("profile-picture", profileFile)
      if (bannerFile) formData.append("banner", bannerFile)

      // const profilePictureId = profileResp?.file_id ?? null
      // const bannerId = bannerResp?.file_id ?? null

      // 3) Cria instituição com JSON – é isso que o back espera
      const res = await fetch("/api/institutions", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")

        throw new Error(text || `Erro ${res.status}`)
      }

      addToast({
        title: "Instituição criada",
        description: "A instituição foi criada com sucesso.",
        color: "success",
        variant: "flat",
      })

      onCreate?.()
      resetForm()
      onOpenChange(false)
    } catch (err) {
      console.error(err)
      const msg =
        (err instanceof Error && err.message) ||
        (typeof err === "string"
          ? err
          : "Ocorreu um erro ao criar a instituição.")

      addToast({
        title: "Não foi possível criar",
        description: msg,
        color: "danger",
        variant: "flat",
      })
    } finally {
      setIsPending(false)
    }
  }, [name, description, onCreate, onOpenChange, resetForm])

  const canSubmit =
    name.trim().length > 0 && description.trim().length > 0 && !isPending

  return (
    <Modal
      classNames={{
        base: "border border-border bg-card text-foreground",
        header: "border-b border-border",
        footer: "border-t border-border",
      }}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="lg"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className="text-base font-semibold">
          ➕ Criar nova instituição
        </ModalHeader>

        <ModalBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              isRequired
              classNames={{ inputWrapper: "bg-background border-border" }}
              label="Nome da Instituição"
              placeholder="Ex.: Instituto Intellecta"
              size="sm"
              value={name}
              variant="bordered"
              onValueChange={setName}
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="description"
            >
              Descrição <span className="text-danger">*</span>
            </label>
            <textarea
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary"
              id="description"
              placeholder="Conte rapidamente sobre a instituição…"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Uploads opcionais — UI mantida */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1 text-sm font-medium">
                Imagem de perfil (opcional)
              </div>
              <FileUpload
                ref={profileRef}
                accept="image/*"
                description="PNG, JPG até 5MB"
                dropzoneLabel="Selecionar imagem"
                maxFiles={1}
                maxSizeMB={5}
                multiple={false}
              />
            </div>

            <div>
              <div className="mb-1 text-sm font-medium">Banner (opcional)</div>
              <FileUpload
                ref={bannerRef}
                accept="image/*"
                description="PNG, JPG até 8MB • proporção 16:9 recomendada"
                dropzoneLabel="Selecionar banner"
                maxFiles={1}
                maxSizeMB={8}
                multiple={false}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            isDisabled={isPending}
            variant="flat"
            onPress={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            isDisabled={!canSubmit}
            isLoading={isPending}
            onPress={handleSubmit}
          >
            Criar instituição
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
