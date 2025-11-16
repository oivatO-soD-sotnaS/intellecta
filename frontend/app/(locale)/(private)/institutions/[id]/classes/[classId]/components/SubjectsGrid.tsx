import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClassSubject, useRemoveClassSubject } from "@/hooks/classes/useClassSubjects"
import { Badge } from "@heroui/badge"
import { Link } from "@heroui/link"
import { addToast } from "@heroui/toast"
import { AnimatePresence, motion } from "framer-motion"
import { Link2, MessageCircle } from "lucide-react"

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
  const removeClassSubject = useRemoveClassSubject(institutionId, classId)

  return (
    <AnimatePresence mode="popLayout">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {classSubjects.map((item) => (
          <motion.div
            key={item.class_subjects_id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <Card className="group flex h-full flex-col justify-between border-border/70 bg-card/70">
              <CardHeader className="space-y-1 pb-3">
                <CardTitle className="flex items-start justify-between gap-2 text-sm">
                  <span className="line-clamp-2">{item.subject.name}</span>
                  <Badge variant="flat" className="shrink-0 text-[10px]">
                    Disciplina
                  </Badge>
                </CardTitle>
                {item.subject.teacher?.full_name && (
                  <p className="text-[11px] text-muted-foreground">
                    Prof. {item.subject.teacher.full_name}
                  </p>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-3 pb-3">
                {item.subject.description && (
                  <p className="line-clamp-3 text-[11px] text-muted-foreground">
                    {item.subject.description}
                  </p>
                )}

                <div className="mt-1 flex items-center justify-between gap-2">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-8 flex-1 gap-1.5 text-xs"
                  >
                    <Link
                      href={`/institutions/${institutionId}/subjects/${item.subject.subject_id}/forum`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Abrir fórum
                    </Link>
                  </Button>

                  {canManageSubjects && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() =>
                        removeClassSubject.mutate(item.class_subjects_id, {
                          onSuccess: () =>
                            addToast({
                              title: "Disciplina desvinculada",
                              description:
                                "A disciplina foi removida desta turma.",
                            }),
                          onError: () =>
                            addToast({
                              title: "Erro ao desvincular",
                              description:
                                "Não foi possível remover a disciplina da turma.",
                            }),
                        })
                      }
                    >
                      <Link2 className="h-4 w-4 rotate-45 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  )
}
