import { FormEvent, useState } from "react"
import { useCreateSubject } from "@/hooks/subjects/useSubjects"
import { useAddSubjectToClass } from "@/hooks/classes/useClassSubjects"
import { addToast } from "@heroui/toast"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input, Textarea } from "@heroui/input"
import { Checkbox } from "@heroui/checkbox"
import { Button } from "@heroui/button"
import { Loader2 } from "lucide-react"


type CreateSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  institutionId: string
  classId: string
}

/**
 * Fluxo:
 * 1) Cria disciplina global: POST /institutions/{institution_id}/subjects
 * 2) Se "vincular à turma" estiver marcado:
 *    POST /institutions/{institution_id}/classes/{class_id}/subjects
 */
export function CreateSubjectSheet({
  open,
  onOpenChange,
  institutionId,
  classId,
}: CreateSheetProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [linkToClass, setLinkToClass] = useState(true)
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  )
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const createSubject = useCreateSubject(institutionId)
  const addToClass = useAddSubjectToClass(institutionId, classId)

  const isSubmitting = createSubject.isPending || addToClass.isPending

  function resetForm() {
    setName("")
    setDescription("")
    setProfilePictureFile(null)
    setBannerFile(null)
    setLinkToClass(true)
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
      onOpenChange={(openValue) => {
        if (!openValue) {
          resetForm()
        }
        onOpenChange(openValue)
      }}
    >
      <SheetContent className="flex w-full flex-col gap-4 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Nova disciplina</SheetTitle>
          <SheetDescription className="text-xs">
            A disciplina será criada na instituição. Você pode optar por já
            vinculá-la à turma atual.
          </SheetDescription>
        </SheetHeader>

        <form className="flex flex-1 flex-col gap-3" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-xs font-medium" htmlFor="subject-name">
              Nome da disciplina
            </label>
            <Input
              id="subject-name"
              placeholder="Ex.: Matemática I"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-medium"
              htmlFor="subject-description"
            >
              Descrição
            </label>
            <Textarea
              id="subject-description"
              placeholder="Descreva brevemente o conteúdo desta disciplina..."
              className="min-h-[90px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">
                Foto de perfil (opcional)
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setProfilePictureFile(e.target.files?.[0] ?? null)
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Banner (opcional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">Vincular à turma atual</span>
              <span className="text-[11px] text-muted-foreground">
                Se marcado, a disciplina será automaticamente adicionada a esta
                turma após a criação.
              </span>
            </div>
            <Checkbox isSelected={linkToClass} onValueChange={setLinkToClass} />
          </div>

          <div className="mt-auto flex justify-end gap-2 pt-2">
            <Button
              variant="light"
              onPress={() => {
                resetForm()
                onOpenChange(false)
              }}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
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
        </form>
      </SheetContent>
    </Sheet>
  )
}
