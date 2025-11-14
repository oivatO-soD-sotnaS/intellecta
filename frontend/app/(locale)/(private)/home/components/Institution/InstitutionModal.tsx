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
  // Helpers de upload (com fallbacks)
  // -----------------------

  async function uploadOnce(endpoint: string, fieldName: string, file: File) {
    const fd = new FormData()
    fd.append(fieldName, file)
    const res = await fetch(endpoint, { method: "POST", body: fd })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      const err = new Error(`${res.status} ${res.statusText} ${text}`.trim())
      // Propaga junto o status para controle de fallback
      // @ts-expect-error attach
      err.status = res.status
      throw err
    }
    return res.json()
  }

  /**
   * Tenta subir o arquivo em várias combinações de (endpoint, field).
   * Para "profile": prioriza o campo exigido pelo backend: profile-asset.
   * Para "banner": rota dedicada pode não existir — fazemos fallback para upload genérico.
   */
  async function uploadWithFallback(
    kind: "profile" | "banner",
    file: File
  ): Promise<any> {
    const attempts: Array<{ endpoint: string; field: string }> =
      kind === "profile"
        ? [
            {
              endpoint: "/api/files/upload-profile-assets",
              field: "profile-asset",
            }, // o exigido pelo backend
            { endpoint: "/api/files/upload-profile-assets", field: "file" }, // fallback 422->file
            { endpoint: "/api/files/upload-file", field: "file" }, // fallback rota genérica
          ]
        : [
            {
              endpoint: "/api/files/upload-banner-assets",
              field: "banner-asset",
            }, // pode dar 404
            { endpoint: "/api/files/upload-file", field: "file" }, // genérico
            {
              endpoint: "/api/files/upload-profile-assets",
              field: "banner-asset",
            }, // reaproveita handler
          ]

    let lastErr: unknown = null

    for (const { endpoint, field } of attempts) {
      try {
        return await uploadOnce(endpoint, field, file)
      } catch (e: any) {
        lastErr = e
        // se 404 numa rota dedicada, seguimos para próxima
        // se 422 por campo ausente, próxima tentativa muda o field
        continue
      }
    }
    throw lastErr ?? new Error("Falha ao enviar arquivo (todas as tentativas).")
  }

  async function maybeUploadAndGetIdUrl(
    file: File | null,
    kind: "profile" | "banner"
  ): Promise<string | null> {
    if (!file) return null

    const payload = await uploadWithFallback(kind, file)

    const fileId =
      // caso o backend use o mesmo formato do ApiFileMeta
      payload?.file_id ??
      // variações comuns
      payload?.fileId ??
      payload?.id ??
      // alguns endpoints retornam o arquivo aninhado em "file"
      payload?.file?.file_id ??
      payload?.file?.fileId ??
      payload?.file?.id

    // 2) se NÃO achar nenhum id, como último recurso usa a url
    return fileId ?? payload?.url ?? null
  }


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

    // Mantém compatibilidade de tipo local (não enviado como FormData)
    const _uiPayload: CreateInstitutionInput = {
      name: name.trim(),
      description: description.trim(),
      profilePictureFile: profileFile ?? undefined,
      bannerFile: bannerFile ?? undefined,
    }

    setIsPending(true)
    try {
      // 1) Uploads com fallbacks robustos
      const [profileIdOrUrl, bannerIdOrUrl] = await Promise.all([
        maybeUploadAndGetIdUrl(profileFile, "profile"),
        maybeUploadAndGetIdUrl(bannerFile, "banner"),
      ])

      // 2) POST JSON puro para /api/institutions
      const res = await fetch("/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          // ajuste os nomes conforme seu backend espera:
          profile_picture_id: profileIdOrUrl,
          banner_id: bannerIdOrUrl,
        }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `Erro ${res.status}`)
      }

      addToast({
        title: "Instituição criada",
        description: "Sua instituição foi criada com sucesso.",
        color: "success",
        variant: "flat",
      })

      onCreate?.()
      resetForm()
      onOpenChange(false)
    } catch (err) {
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
