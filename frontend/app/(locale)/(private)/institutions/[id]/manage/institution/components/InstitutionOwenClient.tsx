// app/(locale)/(private)/institutions/[id]/manage/institution/components/InstitutionClient.tsx
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  useInstitutionSummary,
  useInstitutionDetails,
  useUpdateInstitution,
  useDeleteInstitution,
} from "@/hooks/institutions/useInstitution"
import { toast } from "sonner"
import Back from "../../_components/Back"
import { CardSkeleton, HeaderSkeleton } from "./Skeletons"
import InstitutionHeaderHero from "./InstitutionHeaderHero"
import InstitutionIdentityCard from "./InstitutionIdentityCard"
import InstitutionAboutCard from "./InstitutionAboutCard"
import InstitutionMediaCard from "./InstitutionMediaCard"
import InstitutionDangerZoneCard from "./InstitutionDangerZoneCard"
import { EditInstitutionModal } from "@/app/(locale)/(private)/home/components/Institution/EditInstitutionModal"
import { ConfirmDeleteModal } from "@/app/(locale)/(private)/home/components/Institution/ConfirmDeleteModal"
// Ajuste este import para seu botão Voltar:

type Props = { institutionId: string }

export default function InstitutionClient({ institutionId }: Props) {
  const router = useRouter()
  const summary = useInstitutionSummary(institutionId)
  const details = useInstitutionDetails(institutionId)

  const updateMutation = useUpdateInstitution(institutionId)
  const deleteMutation = useDeleteInstitution(institutionId)

  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const handleUpdateText = async (values: {
    name?: string
    email?: string
    description?: string
  }) => {
    try {
      await updateMutation.mutateAsync({ type: "text", data: values })
      toast.success("Instituição atualizada")
      setEditOpen(false)
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao atualizar dados")
    }
  }

  const handleUpdateMedia = async (files: {
    profilePicture?: File | null
    banner?: File | null
  }) => {
    try {
      await updateMutation.mutateAsync({ type: "media", data: files })
      toast.success("Imagens atualizadas")
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao atualizar imagens")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync()
      toast.success("Instituição excluída")
      setDeleteOpen(false)
      router.replace("/institutions")
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao excluir instituição")
    }
  }

  const loading = summary.isLoading || details.isLoading
  const s = summary.data
  const d = details.data

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Back />
        {/* espaço para ações globais se precisar */}
      </div>

      {loading ? (
        <>
          <HeaderSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <CardSkeleton />
            </div>
          </div>
        </>
      ) : !s || !d ? (
        <div className="text-center py-16 text-muted-foreground">
          Instituição não encontrada.
        </div>
      ) : (
        <>
          <InstitutionHeaderHero
            name={s.name}
            email={s.email}
            bannerUrl={s.banner?.url ?? undefined}
            logoUrl={s.profile_picture?.url ?? undefined}
            onEditClick={() => setEditOpen(true)}
            onScrollToMedia={() => {
              const el = document.getElementById("media-card")
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <InstitutionIdentityCard
                name={d.name}
                email={d.email}
                onEdit={() => setEditOpen(true)}
              />
              <InstitutionAboutCard
                description={d.description ?? ""}
                onEdit={() => setEditOpen(true)}
              />
              <InstitutionMediaCard
                id="media-card"
                logoUrl={d.profile_picture?.url ?? undefined}
                bannerUrl={d.banner?.url ?? undefined}
                onSave={handleUpdateMedia}
              />
            </div>

            <div className="lg:col-span-1 space-y-6">
              <InstitutionDangerZoneCard onDelete={() => setDeleteOpen(true)} />
            </div>
          </div>
        </>
      )}

      {/* Modais reutilizados do projeto */}
      <EditInstitutionModal
        institutionId={institutionId}
        isOpen={editOpen}
        onOpenChange={setEditOpen}
        defaultValues={{
          name: d?.name ?? "",
          email: d?.email ?? "",
          description: d?.description ?? "",
        }}
        onSubmit={handleUpdateText}
      />

      <ConfirmDeleteModal
        institutionId={institutionId}
        isOpen={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        name={""}
        onDeleted={() => {}}
      />
    </div>
  )
}
