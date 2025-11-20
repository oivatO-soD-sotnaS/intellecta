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
import type { InstitutionSummary } from "@/types/institution"
import { useQueryClient } from "@tanstack/react-query"

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  institution: InstitutionSummary   // ← Agora usando sua tipagem real
  onUpdated: () => void
}

export function EditInstitutionModal({
  isOpen,
  onOpenChange,
  institution,
  onUpdated,
}: Props) {
  const [name, setName] = React.useState(institution.name)
  const [description, setDescription] = React.useState(institution.description)

  const [profileId, setProfileId] = React.useState(
    institution.profilePicture?.file_id ?? null
  )
  const [bannerId, setBannerId] = React.useState(
    institution.banner?.file_id ?? null
  )

  const profileRef = React.useRef<FileUploadHandle>(null)
  const bannerRef = React.useRef<FileUploadHandle>(null)

  const [isPending, setIsPending] = React.useState(false)
  const qc = useQueryClient()

  // Atualiza campos ao abrir
  React.useEffect(() => {
    if (isOpen) {
      setName(institution.name)
      setDescription(institution.description)
      setProfileId(institution.profilePicture?.file_id ?? null)
      setBannerId(institution.banner?.file_id ?? null)

      profileRef.current?.clear()
      bannerRef.current?.clear()
    }
  }, [isOpen, institution])

  // ==============================
  // Upload individual
  // ==============================
  const uploadAsset = async (file: File): Promise<string> => {
    const fd = new FormData()
    fd.append("profile-asset", file)

    const res = await fetch("/api/files/upload-profile-assets", {
      method: "POST",
      body: fd,
    })

    if (!res.ok) throw new Error("Erro ao enviar arquivo.")

    const data = await res.json()
    return data.file_id
  }

  // ==============================
  // Submit (PUT sem arquivos)
  // ==============================
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

    setIsPending(true)
    try {
      let newProfileId = profileId
      let newBannerId = bannerId

      const selectedProfile = profileRef.current?.getRawFiles()?.[0] ?? null
      const selectedBanner = bannerRef.current?.getRawFiles()?.[0] ?? null

      // Upload individual se necessário
      if (selectedProfile) newProfileId = await uploadAsset(selectedProfile)
      if (selectedBanner) newBannerId = await uploadAsset(selectedBanner)

      const payload = {
        name: name.trim(),
        description: description.trim(),
        profile_picture_id: newProfileId,
        banner_id: newBannerId,
      }

      const res = await fetch(`/api/institutions/${institution.institution_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `Erro ${res.status}`)
      }

      addToast({
        title: "Instituição atualizada",
        description: "As alterações foram salvas com sucesso.",
        color: "success",
        variant: "flat",
      })

      onUpdated()
      onOpenChange(false)
    } catch (err) {
      console.error(err)
      addToast({
        title: "Erro ao atualizar",
        description:
          err instanceof Error ? err.message : "Não foi possível atualizar.",
        color: "danger",
        variant: "flat",
      })
    } finally {
      qc.invalidateQueries({queryKey: ["institutions", "summaries"]})
      setIsPending(false)
    }
  }, [name, description, profileId, bannerId, institution.institution_id, onUpdated, onOpenChange])

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
          ✏️ Editar instituição
        </ModalHeader>

        <ModalBody className="space-y-4">

          {/* Nome */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              isRequired
              label="Nome da Instituição"
              placeholder="Ex.: Instituto Intellecta"
              size="sm"
              value={name}
              variant="bordered"
              classNames={{ inputWrapper: "bg-background border-border" }}
              onValueChange={setName}
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="description">
              Descrição <span className="text-danger">*</span>
            </label>
            <textarea
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              id="description"
              rows={4}
              value={description}
              placeholder="Atualize a descrição…"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Uploads */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Perfil */}
            <div>
              <div className="mb-1 text-sm font-medium">Imagem de perfil</div>

              {institution.profilePicture?.url && (
                <img
                  src={institution.profilePicture.url}
                  alt="Imagem atual de perfil"
                  className="mb-2 mx-auto h-20 w-20 object-cover border border-border"
                />
              )}

              <FileUpload
                ref={profileRef}
                accept="image/*"
                description="PNG, JPG até 5MB"
                dropzoneLabel="Trocar imagem"
                maxFiles={1}
                maxSizeMB={5}
                multiple={false}
              />
            </div>


            {/* Banner */}
            <div>
              <div className="mb-1 text-sm font-medium">Banner</div>

              {institution.banner?.url && (
                <img
                  src={institution.banner.url}
                  alt="Banner atual"
                  className="mb-2 w-full h-24 rounded-lg object-cover border border-border"
                />
              )}

              <FileUpload
                ref={bannerRef}
                accept="image/*"
                description="PNG, JPG até 8MB • 16:9 recomendado"
                dropzoneLabel="Trocar banner"
                maxFiles={1}
                maxSizeMB={8}
                multiple={false}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" isDisabled={isPending} onPress={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            color="primary"
            isDisabled={!canSubmit}
            isLoading={isPending}
            onPress={handleSubmit}
          >
            Salvar alterações
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
