"use client"

import { FormEvent, useRef, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input, Textarea } from "@heroui/input"
import { Checkbox } from "@heroui/checkbox"
import { Button } from "@heroui/button"
import { Loader2, Sparkles } from "lucide-react"
import { addToast } from "@heroui/toast"

import { useCreateSubject } from "@/hooks/subjects/useSubjects"
import { useAddSubjectToClass } from "@/hooks/classes/useClassSubjects"
import FileUpload, { type FileUploadHandle } from "@/components/comp-547"
import { AIAssistantButton } from "@/app/(locale)/(private)/components/AIAssistantButton"

type CreateSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  institutionId: string
  classId: string
}

export function CreateSubjectSheet({
  open,
  onOpenChange,
  institutionId,
  classId,
}: CreateSheetProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [linkToClass, setLinkToClass] = useState(true)

  const profileRef = useRef<FileUploadHandle | any>(null)
  const bannerRef = useRef<FileUploadHandle | any>(null)

  const createSubject = useCreateSubject(institutionId)
  const addToClass = useAddSubjectToClass(institutionId, classId)

  const isSubmitting = createSubject.isPending || addToClass.isPending

  const getRawFile = (ref: any): File | null => {
    try {
      const raw = ref.current?.getRawFiles?.()
      return Array.isArray(raw) ? (raw[0] ?? null) : null
    } catch {
      return null
    }
  }

  function resetForm() {
    setName("")
    setDescription("")
    setLinkToClass(true)
    try {
      profileRef.current?.clear?.()
    } catch {}
    try {
      bannerRef.current?.clear?.()
    } catch {}
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      addToast({
        title: "Nome obrigatório",
        description: "Digite o nome da disciplina.",
      })
      return
    }

    try {
      const profilePictureFile = getRawFile(profileRef)
      const bannerFile = getRawFile(bannerRef)

      const res = await createSubject.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        profilePictureFile,
        bannerFile,
      })

      const subjectId = res.subject.subject_id

      if (linkToClass && classId) {
        await addToClass.mutateAsync({ subject_id: subjectId })
      }

      addToast({
        title: "Disciplina criada",
        description: linkToClass
          ? "A disciplina foi criada e vinculada a esta turma."
          : "A disciplina foi criada na instituição.",
      })

      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      addToast({
        title: "Erro ao criar disciplina",
        description:
          "Verifique os dados informados ou tente novamente em instantes.",
      })
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        if (!value) resetForm()
        onOpenChange(value)
      }}
    >
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-xl p-0">
        {/* Cabeçalho */}
        <div className="border-b px-4 pb-3 pt-4">
          <SheetHeader className="items-start">
            <SheetTitle className="text-base font-semibold">
              Nova disciplina
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              A disciplina será criada na instituição. Você pode optar por
              vinculá-la automaticamente à turma atual.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Corpo do formulário */}
        <form
          className="flex flex-1 flex-col overflow-y-auto px-4 py-4"
          onSubmit={handleSubmit}
        >
          <div className="mb-3 rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm space-y-4">
            {/* Seção: Informações */}
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Informações da disciplina
              </p>
              <p className="text-[11px] text-muted-foreground">
                Nome e descrição que aparecerão para alunos e professores.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label
                  className="text-xs font-medium"
                  htmlFor="subject-name-input"
                >
                  Nome da disciplina
                </label>
                <Input
                  id="subject-name-input"
                  size="sm"
                  radius="sm"
                  variant="bordered"
                  placeholder="Ex.: Matemática I, Física III, Programação Web"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  classNames={{
                    inputWrapper:
                      "bg-background border-border/60 data-[hover=true]:border-primary/40",
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-xs font-medium"
                  htmlFor="subject-description-input"
                >
                  Descrição
                </label>
                <Textarea
                  id="subject-description-input"
                  size="sm"
                  radius="sm"
                  variant="bordered"
                  placeholder="Descreva brevemente o conteúdo, objetivos e perfil da disciplina..."
                  className="min-h-[90px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  classNames={{
                    inputWrapper:
                      "bg-background border-border/60 data-[hover=true]:border-primary/40",
                  }}
                />
              </div>
            </div>

            {/* Seção: Imagens */}
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Identidade visual
              </p>
              <p className="text-[11px] text-muted-foreground">
                Escolha uma foto de perfil e um banner para destacar esta
                disciplina no painel.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium">
                    Foto de perfil (opcional)
                  </span>
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
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium">
                    Banner (opcional)
                  </span>
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
              </div>
            </div>

            {/* Seção: Configuração */}
            <div className="mt-4 rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Vincular à turma atual
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Se marcado, a disciplina será automaticamente adicionada a
                  esta turma após a criação.
                </p>
              </div>
              <Checkbox
                isSelected={linkToClass}
                onValueChange={setLinkToClass}
                size="sm"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto border-t border-border/60 bg-background/90 px-4 py-3 -mx-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Use a IA para sugerir nome e descrição da disciplina.</span>
            </div>

            <div className="flex items-center gap-2">
              <AIAssistantButton
                endpoint="/api/ai/subjects/suggest"
                title="IA para disciplina"
                textareaPlaceholder="Descreva que disciplina você quer criar (conteúdos, nível de ensino, foco, público-alvo, etc.)..."
                submitLabel="Gerar com IA"
                successTitle="Sugestão criada!"
                successDescription="Preenchemos o nome e a descrição da disciplina para você. Revise antes de salvar."
                disable={isSubmitting}
                onSuccess={(data) => {
                  if (typeof data?.name === "string") {
                    setName(data.name)
                  }
                  if (typeof data?.description === "string") {
                    setDescription(data.description)
                  }
                }}
              />

              <Button
                variant="light"
                size="sm"
                onPress={() => {
                  resetForm()
                  onOpenChange(false)
                }}
                isDisabled={isSubmitting}
              >
                Cancelar
              </Button>

              <Button
                color="primary"
                size="sm"
                type="submit"
                isDisabled={isSubmitting}
                startContent={
                  isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null
                }
              >
                Criar disciplina
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
