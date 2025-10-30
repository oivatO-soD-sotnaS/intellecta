"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner" // se você usa sonner; se não, troque por seu sistema de toast
import {
  Copy,
  Edit2,
  Image as ImageIcon,
  ShieldAlert,
  Trash2,
  Upload,
  Save,
  Info,
} from "lucide-react"
import type { InstitutionDetails, FileRef } from "./types"
import { mockInstitution } from "./mocks"
import { Badge } from "@heroui/badge"
import Back from "../../_components/Back"

export default function InstitutionOwenClient({
  institutionId,
}: {
  institutionId: string
}) {
  const [inst, setInst] = useState<InstitutionDetails | null>(null)

  // preview locais (quando o usuário escolhe arquivos antes de salvar)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  // edição do perfil
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [description, setDescription] = useState("")

  // dialogs
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  useEffect(() => {
    // mock inicial
    const data = mockInstitution(institutionId)
    setInst(data)
    setName(data.name)
    setEmail(data.email)
    setDescription(data.description || "")
  }, [institutionId])

  const bannerUrl = useMemo(
    () => bannerPreview || inst?.banner?.url || "",
    [bannerPreview, inst]
  )
  const logoUrl = useMemo(
    () => logoPreview || inst?.profile_picture?.url || "",
    [logoPreview, inst]
  )

  function copyId() {
    navigator.clipboard.writeText(institutionId).then(() => {
      toast?.success?.("ID copiado!")
    })
  }

  // salvar perfil (mock)
  function saveProfile() {
    if (!inst) return
    setInst({ ...inst, name, email, description })
    toast?.success?.("Dados atualizados (mock).")
  }

  // salvar mídia (mock)
  function saveMedia() {
    if (!inst) return
    const updated: InstitutionDetails = { ...inst }

    if (logoPreview) {
      updated.profile_picture = {
        file_id: `logo-${Date.now()}`,
        url: logoPreview,
        filename: "logo-local.png",
        mime_type: "image/png",
        size: 0,
      }
    }
    if (bannerPreview) {
      updated.banner = {
        file_id: `banner-${Date.now()}`,
        url: bannerPreview,
        filename: "banner-local.jpg",
        mime_type: "image/jpeg",
        size: 0,
      }
    }
    setInst(updated)
    toast?.success?.("Mídia atualizada (mock).")
  }

  // excluir (mock)
  function confirmDelete() {
    setConfirmDeleteOpen(false)
    // Aqui só limpamos localmente
    setInst(null)
    toast?.success?.("Instituição excluída (mock).")
  }

  function onPickFile(
    e: React.ChangeEvent<HTMLInputElement>,
    kind: "logo" | "banner"
  ) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    if (kind === "logo") setLogoPreview(url)
    else setBannerPreview(url)
  }

  if (!inst) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">
              Instituição removida (mock)
            </CardTitle>
            <CardDescription>
              Esta é uma simulação local para testes de UI.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 space-y-6">
      <div className="space-x-4">
        <Back
          hrefFallback={`/institutions/${institutionId}/manage/classes-subjects`}
        />
      </div>
      {/* HERO (banner + logo + título) */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="h-48 md:h-56 w-full bg-muted/40">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt="Banner da instituição"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-muted-foreground text-sm">
              <ImageIcon className="h-5 w-5 mr-2" />
              Sem banner
            </div>
          )}
        </div>

        {/* Gradiente para legibilidade do cabeçalho */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Header flutuante */}
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
          <div className="flex items-end gap-4">
            {/* LOGO */}
            <div className="relative -mb-10 md:-mb-12">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl ring-4 ring-background overflow-hidden bg-background shadow-md">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center text-muted-foreground text-xs">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>

            {/* NOME + email */}
            <div className="flex-1 text-white drop-shadow">
              <div className="text-xl md:text-2xl font-semibold">
                {inst.name}
              </div>
              <div className="text-sm opacity-90">{inst.email}</div>
            </div>

            {/* Ações rápidas */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="secondary"
                className="rounded-xl"
                onClick={copyId}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar ID
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5" />
            Configurações da Instituição
          </CardTitle>
          <CardDescription>
            Logo, nome e configurações avançadas.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Separator className="mb-4" />

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="rounded-xl">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="media">Mídia</TabsTrigger>
              <TabsTrigger value="advanced">Avançado</TabsTrigger>
            </TabsList>

            {/* PERFIL */}
            <TabsContent value="profile" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="grid gap-2">
                    <Label>Nome da instituição</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>E-mail</Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Descrição</Label>
                    <Textarea
                      rows={6}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="solid">
                      ID: {inst.institution_id.slice(0, 8)}…
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={copyId}
                    >
                      <Copy className="h-4 w-4 mr-2" /> Copiar ID
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border p-4">
                    <div className="text-sm font-medium mb-2">
                      Dicas de preenchimento
                    </div>
                    <ul className="text-sm text-muted-foreground list-disc ms-5 space-y-1">
                      <li>Nome curto e objetivo (até ~60 caracteres).</li>
                      <li>Descrição focada na missão/visão e público.</li>
                      <li>Use um e-mail institucional ativo.</li>
                    </ul>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button onClick={saveProfile} className="rounded-xl">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar alterações (mock)
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* MÍDIA */}
            <TabsContent value="media" className="pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LOGO */}
                <div className="rounded-2xl border overflow-hidden">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Logo</div>
                      <div className="text-xs text-muted-foreground">
                        Recomenda-se PNG/SVG com fundo transparente (≥ 256×256).
                      </div>
                    </div>
                    <Badge variant="solid">Prévia</Badge>
                  </div>
                  <div className="p-4 pt-0">
                    <div className="h-36 w-36 rounded-2xl border bg-muted/30 overflow-hidden grid place-items-center">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="Logo preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Sem logo
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onPickFile(e, "logo")}
                          className="hidden"
                          id="logo-input"
                        />
                        <Button
                          variant="outline"
                          className="rounded-xl"
                          onClick={() =>
                            document.getElementById("logo-input")?.click()
                          }
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Enviar logo
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                {/* BANNER */}
                <div className="rounded-2xl border overflow-hidden">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Banner</div>
                      <div className="text-xs text-muted-foreground">
                        Recomenda-se 1200×320 ou maior (16:4), JPG/PNG.
                      </div>
                    </div>
                    <Badge variant="solid">Prévia</Badge>
                  </div>
                  <div className="p-4 pt-0">
                    <div className="h-40 w-full rounded-xl border bg-muted/30 overflow-hidden">
                      {bannerUrl ? (
                        <img
                          src={bannerUrl}
                          alt="Banner preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-sm text-muted-foreground">
                          Sem banner
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onPickFile(e, "banner")}
                          className="hidden"
                          id="banner-input"
                        />
                        <Button
                          variant="outline"
                          className="rounded-xl"
                          onClick={() =>
                            document.getElementById("banner-input")?.click()
                          }
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Enviar banner
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button onClick={saveMedia} className="rounded-xl">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar mídia (mock)
                </Button>
              </div>
            </TabsContent>

            {/* AVANÇADO */}
            <TabsContent value="advanced" className="pt-4">
              <div className="rounded-2xl border p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-destructive" />
                  <div className="text-sm font-medium">Zona de perigo</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  As ações abaixo são irreversíveis. No backend real, somente
                  administradores podem executá-las.
                </p>

                <Separator />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-sm">
                      Excluir instituição
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Remove a instituição e seus vínculos (mock nesta etapa).
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    className="rounded-xl"
                    onClick={() => setConfirmDeleteOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir instituição
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog excluir */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Excluir instituição</DialogTitle>
            <DialogDescription>
              Esta operação é definitiva. Confirma excluir esta instituição?
              (mock)
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={confirmDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
