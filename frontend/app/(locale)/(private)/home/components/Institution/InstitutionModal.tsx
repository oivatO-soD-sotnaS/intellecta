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

import type { CreateInstitutionInput } from "@/types/institution"
import { useUploadProfileAsset } from "@/hooks/files/useUploadProfileAsset"
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

  const uploadProfileAsset = useUploadProfileAsset()

  const resetForm = React.useCallback(() => {
    setName("")
    setDescription("")
    profileRef.current?.clear()
    bannerRef.current?.clear()
  }, [])

  const handleSubmit = async () => {
    // 1) Validações básicas
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
      // 2) Sobe avatar e banner (se existirem) em paralelo
      const [profileResp, bannerResp] = await Promise.all([
        profileFile
          ? uploadProfileAsset.mutateAsync(profileFile)
          : Promise.resolve(null),
        bannerFile
          ? uploadProfileAsset.mutateAsync(bannerFile)
          : Promise.resolve(null),
      ])

      const profilePictureId = profileResp?.file_id ?? null
      const bannerId = bannerResp?.file_id ?? null

      // 3) Cria instituição com JSON – é isso que o back espera
      const res = await fetch("/api/institutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          profile_picture_id: profilePictureId,
          banner_id: bannerId,
        }),
      })

      if (!res.ok) {
        // Tenta interpretar a resposta como JSON
        let errorPayload: any = null
        try {
          errorPayload = await res.json()
        } catch {
        }

        const backendMessage =
          errorPayload?.error?.message ||
          errorPayload?.message ||
          errorPayload?.error ||
          null

        // Caso específico: limite de instituições atingido (403)
        if (
          res.status === 403 &&
          backendMessage?.includes("maximum number of owned institutions")
        ) {
          addToast({
            title: "Limite de instituições atingido",
            description:
              "Você já possui 3 instituições. Exclua uma delas ou use outra conta para criar mais.",
            color: "warning",
            variant: "flat",
          })
          // Não lança erro – tratamos aqui
          return
        }

        // Outros erros: lança com mensagem mais limpa
        throw new Error(backendMessage || `Erro ${res.status}`)
      }

      addToast({
        title: "Instituição criada",
        description: "A instituição foi criada com sucesso.",
        color: "success",
        variant: "flat",
      })

      onCreate()
      resetForm()
      onOpenChange(false)
    } catch (err) {
      console.error(err)
      const msg =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao criar a instituição."

      addToast({
        title: "Não foi possível criar",
        description: msg,
        color: "danger",
        variant: "flat",
      })
    } finally {
      setIsPending(false)
    }
  }

  const canSubmit =
    name.trim().length > 0 && description.trim().length > 0 && !isPending

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      classNames={{
        base: "border border-border bg-card text-foreground",
        header: "border-b border-border",
        footer: "border-t border-border",
      }}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="text-base font-semibold">
          ➕ Criar nova instituição
        </ModalHeader>

        <ModalBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nome da Instituição"
              value={name}
              onValueChange={setName}
              isRequired
              variant="bordered"
              size="sm"
              classNames={{ inputWrapper: "bg-background border-border" }}
              placeholder="Ex.: Instituto Intellecta"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Descrição <span className="text-danger">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary"
              placeholder="Conte rapidamente sobre a instituição…"
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
                multiple={false}
                maxFiles={1}
                maxSizeMB={5}
                description="PNG, JPG até 5MB"
                dropzoneLabel="Selecionar imagem"
              />
            </div>

            <div>
              <div className="mb-1 text-sm font-medium">Banner (opcional)</div>
              <FileUpload
                ref={bannerRef}
                accept="image/*"
                multiple={false}
                maxFiles={1}
                maxSizeMB={8}
                description="PNG, JPG até 8MB • proporção 16:9 recomendada"
                dropzoneLabel="Selecionar banner"
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="flat"
            onPress={() => onOpenChange(false)}
            isDisabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isDisabled={!canSubmit}
            isLoading={isPending}
          >
            Criar instituição
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
