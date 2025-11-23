// app/(locale)/(private)/institutions/[id]/manage/institution/page.tsx
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Building, Trash2, AlertTriangle, Calendar, Users, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import FileUpload, { type FileUploadHandle } from "@/components/comp-547"
import { useQueryClient } from "@tanstack/react-query"
import { useInstitution } from "../../layout"
import { addToast } from "@heroui/toast"
import { useDeleteInstitution } from "@/hooks/institution/useDeleteInstitution"
import Back from "../_components/Back"

export default function InstitutionSettingsPage() {
  const { institution, me } = useInstitution()
  const router = useRouter()
  const qc = useQueryClient()
  const deleteInstitution = useDeleteInstitution(institution.institution_id)

  // Estados do formulário - EXATAMENTE como no modal
  const [name, setName] = React.useState(institution.name)
  const [description, setDescription] = React.useState(institution.description || "")
  const [profileId, setProfileId] = React.useState(institution.profilePicture?.file_id ?? null)
  const [bannerId, setBannerId] = React.useState(institution.banner?.file_id ?? null)
  const [isPending, setIsPending] = React.useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

  // Refs para upload de arquivos - EXATAMENTE como no modal
  const profileRef = React.useRef<FileUploadHandle>(null)
  const bannerRef = React.useRef<FileUploadHandle>(null)

  // ==============================
  // Upload individual - EXATAMENTE como no modal
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
  // Submit (PUT sem arquivos) - EXATAMENTE como no modal
  // ==============================
  const handleSubmit = React.useCallback(async () => {
    if (!name.trim() || !description.trim()) {
      addToast({
        title: "Preencha os campos obrigatórios",
        description: "Nome e descrição são obrigatórios.",
        color: "danger",
      })
      return
    }

    setIsPending(true)
    try {
      let newProfileId = profileId
      let newBannerId = bannerId

      const selectedProfile = profileRef.current?.getRawFiles()?.[0] ?? null
      const selectedBanner = bannerRef.current?.getRawFiles()?.[0] ?? null

      // Upload individual se necessário - EXATAMENTE como no modal
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
        color: "success"
      })

      // Invalidar queries - EXATAMENTE como no modal
      qc.invalidateQueries({ queryKey: ["institution", institution.institution_id] })
      
    } catch (err) {
      console.error(err)
      addToast({
        title: "Erro ao atualizar",
        description: err instanceof Error ? err.message : "Não foi possível atualizar.",
        color: "danger",
      })
    } finally {
      setIsPending(false)
    }
  }, [name, description, profileId, bannerId, institution.institution_id, router, qc])

  // ==============================
  // Deletar instituição
  // ==============================
  const handleDelete = async () => {
    try {
      await deleteInstitution.mutateAsync()
      addToast({
        title: "Instituição excluída",
        description: "A instituição foi removida com sucesso.",
        color: "success",
      })
      router.push("/home")
    } catch (error: any) {
      addToast({
        title: "Erro ao excluir",
        description: error?.data?.message || "Não foi possível excluir a instituição.",
        color: "danger",
      })
    }
  }

  const canSubmit = name.trim().length > 0 && description.trim().length > 0 && !isPending

  // Função auxiliar para formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Instituição</h1>
            <p className="text-muted-foreground">
              Atualize as informações da instituição {institution.name}
            </p>
          </div>
        </div>
        <Back hrefFallback={`/institutions/${institution.institution_id}/manage`}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário - ESTRUTURA IDÊNTICA ao modal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Editar instituição
              </CardTitle>
              <CardDescription>
                Atualize as informações básicas e imagens da sua instituição
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Instituição *</Label>
                  <Input
                    id="name"
                    required
                    placeholder="Ex.: Instituto Intellecta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Descrição <span className="text-destructive">*</span>
                </Label>
                <textarea
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  id="description"
                  rows={4}
                  value={description}
                  placeholder="Atualize a descrição…"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Uploads */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Perfil */}
                <div className="space-y-3">
                  <Label>Imagem de perfil</Label>
                  
                  {institution.profilePicture?.url && (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={institution.profilePicture.url}
                        alt="Imagem atual de perfil"
                        className="h-20 w-20 rounded-lg object-cover border border-border"
                      />
                      <span className="text-xs text-muted-foreground">Imagem atual</span>
                    </div>
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
                <div className="space-y-3">
                  <Label>Banner</Label>
                  
                  {institution.banner?.url && (
                    <div className="space-y-2">
                      <img
                        src={institution.banner.url}
                        alt="Banner atual"
                        className="w-full h-24 rounded-lg object-cover border border-border"
                      />
                      <span className="text-xs text-muted-foreground">Banner atual</span>
                    </div>
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

              {/* Footer - Similar ao modal */}
              <div className="flex gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/institutions/${institution.institution_id}/manage`)}
                  disabled={isPending}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex-1 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isPending ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com Metadados e Ações Perigosas */}
        <div className="space-y-6">
          {/* Card de Metadados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ID:</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {institution.institution_id}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Papel:</span>
                <Badge variant={me.role === "admin" ? "default" : "secondary"}>
                  {me.role === "admin" ? "Administrador" : 
                   me.role === "teacher" ? "Professor" : "Estudante"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Card de Ações Perigosas */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Zona de Perigo
              </CardTitle>
              <CardDescription>
                Ações irreversíveis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription className="text-sm">
                  A exclusão da instituição removerá todos os dados, incluindo turmas, 
                  usuários e eventos. Esta ação não pode ser desfeita.
                </AlertDescription>
              </Alert>

              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleteInstitution.isPending}
                className="w-full flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {deleteInstitution.isPending ? "Excluindo..." : "Excluir Instituição"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Confirmar Exclusão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tem certeza que deseja excluir a instituição <strong>"{institution.name}"</strong>? 
                Esta ação não pode ser desfeita e todos os dados serão perdidos permanentemente.
              </p>
            </CardContent>
            <CardContent className="flex gap-3">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteInstitution.isPending}
                className="flex-1"
              >
                {deleteInstitution.isPending ? "Excluindo..." : "Sim, Excluir"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteInstitution.isPending}
                className="flex-1"
              >
                Cancelar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}