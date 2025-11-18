import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ClassSubject,
  useRemoveClassSubject,
} from "@/hooks/classes/useClassSubjects"
import { Badge } from "@heroui/badge"
import { Link } from "@heroui/link"
import { addToast } from "@heroui/toast"
import { AnimatePresence, motion } from "framer-motion"
import { Link2, MessageCircle } from "lucide-react"
import Image from "next/image"

type GridProps = {
  institutionId: string
  classId: string
  classSubjects: ClassSubject[]
  canManageSubjects?: boolean
}

export function SubjectsGrid({
  institutionId,
  classId,
  classSubjects,
  canManageSubjects,
}: GridProps) {
  const { mutateAsync: removeClassSubject, isPending } = useRemoveClassSubject(
    institutionId,
    classId
  )

  if (!classSubjects.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma disciplina vinculada a esta turma ainda.
      </p>
    )
  }

  return (
    <AnimatePresence mode="popLayout">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {classSubjects.map((classSubject) => {
          const subject = classSubject.subject

          const subjectName = subject?.name ?? "Disciplina sem nome"
          const teacherName =
            subject?.teacher?.full_name ?? "Professor não definido"
          const description =
            subject?.description || "Nenhuma descrição informada."

          const teacherInitials =
            subject?.teacher?.full_name
              ?.split(" ")
              .filter(Boolean)
              .map((p) => p[0])
              .join("")
              .toUpperCase() ?? "P"

          // id da relação classe–disciplina
          const subjectId =
            (classSubject as any).class_subjects_id ??
            subject?.subject_id ??
            String(Math.random())

          // Banner pode vir como string ou como objeto de arquivo
          const banner =
            typeof subject?.banner === "object"
              ? (subject.banner as any)?.url
              : subject?.banner

          // Profile picture da disciplina ou do professor
          const profilePicture =
            typeof subject?.profile_picture === "object"
              ? (subject.profile_picture as any)?.url
              : subject?.profile_picture ||
                (subject?.teacher?.profile_picture as any)?.url

                
          const subjectHref = `/institutions/${institutionId}/subjects/${subjectId}`
          const forumHref = `${subjectHref}/forum`

          return (
            <motion.div
              key={subjectId}
              layout
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <Card className="flex h-full flex-col overflow-hidden border border-border/60 bg-gradient-to-b from-background to-muted/40 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                {/* Banner */}
                <div className="relative h-20 w-full">
                  {banner ? (
                    <Image
                      src={banner}
                      alt={`Banner da disciplina ${subjectName}`}
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400" />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                  <div className="absolute right-3 top-3">
                    <Badge
                      size="sm"
                      className="rounded-full border border-emerald-100 bg-emerald-50 text-[0.65rem] font-semibold text-emerald-700"
                    >
                      Disciplina
                    </Badge>
                  </div>
                </div>

                {/* Conteúdo */}
                <CardContent className="flex flex-1 flex-col justify-between gap-3 pt-3">
                  <div className="flex items-start gap-3">
                    {/* Avatar do professor / disciplina */}
                    <div className="relative h-10 w-10 shrink-0">
                      {profilePicture ? (
                        <div className="relative h-full w-full overflow-hidden rounded-full border border-border/70 bg-muted">
                          <Image
                            src={profilePicture}
                            alt={`Foto do professor ${teacherName}`}
                            fill
                            unoptimized
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full border border-border/70 bg-muted text-xs font-semibold text-muted-foreground">
                          {teacherInitials}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold leading-tight text-foreground">
                        {subjectName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Prof. {teacherName}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="mt-2 flex items-center gap-2">
                    {/* Ver disciplina */}
                    <Link
                      href={subjectHref}
                      className="flex-1"
                      underline="none"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full justify-center text-xs"
                      >
                        Ver disciplina
                      </Button>
                    </Link>

                    {/* Abrir fórum */}
                    <Link href={forumHref} className="flex-1" underline="none">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full justify-center gap-1 text-xs text-emerald-700 hover:text-emerald-800"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Abrir fórum</span>
                      </Button>
                    </Link>

                    {/* Ação extra (ex: remover disciplina da turma) */}
                    {canManageSubjects && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        disabled={isPending}
                        onClick={async () => {
                          try {
                            await removeClassSubject(subjectId)
                            addToast({
                              title: "Disciplina removida da turma",
                              description:
                                "A disciplina foi removida com sucesso.",
                              color: "success",
                            })
                          } catch (error) {
                            addToast({
                              title: "Erro ao remover disciplina",
                              description:
                                "Não foi possível remover a disciplina da turma.",
                              color: "danger",
                            })
                          }
                        }}
                      >
                        <Link2 className="h-4 w-4 rotate-45 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </AnimatePresence>
  )
}
