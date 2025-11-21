"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Link as LinkIcon, Plus, Unlink } from "lucide-react"
import type { Class, ClassSubject, Subject } from "./types"
import { Badge } from "@heroui/badge"
import AppAvatar from "@/app/(locale)/(private)/components/AppAvatar"
import AddSubjectToClassDrawer from "./AddSubjectToClassDrawer"

export default function ClassLinks({
  classes,
  links,
  subjectsCatalog,
  onAdd,
  onRemove,
}: {
  classes: Class[]
  links: Record<string, ClassSubject[]>
  subjectsCatalog: Subject[]
  onAdd: (class_id: string, subject_ids: string[]) => void
  onRemove: (class_id: string, class_subjects_id: string) => void
}) {
  const [classId, setClassId] = useState<string>(classes[0]?.class_id ?? "")
  const [drawerOpen, setDrawerOpen] = useState(false)

  const current = links[classId] ?? []
  const alreadyLinkedSubjectIds = useMemo(
    () => new Set(current.map((cs) => cs.subject.subject_id)),
    [current]
  )
  const available = useMemo(
    () =>
      subjectsCatalog.filter((s) => !alreadyLinkedSubjectIds.has(s.subject_id)),
    [subjectsCatalog, alreadyLinkedSubjectIds]
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      <Card className="rounded-2xl h-min">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Turma</CardTitle>
          <CardDescription>Escolha qual turma deseja gerenciar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <select
            className="w-full h-9 rounded-lg border bg-background px-3 text-sm"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c.class_id} value={c.class_id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="text-xs text-muted-foreground pt-1">
            {current.length} disciplina(s) vinculada(s)
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Disciplinas vinculadas
              </CardTitle>
              <CardDescription>
                Adicione ou remova vínculos entre a turma selecionada e o
                catálogo
              </CardDescription>
            </div>
            <Button className="rounded-xl" onClick={() => setDrawerOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Vincular
            </Button>
          </div>
          <Separator className="mt-3" />
        </CardHeader>

        <CardContent>
          {current.length === 0 ? (
            <div className="text-sm text-muted-foreground py-10 text-center">
              Nenhuma disciplina vinculada. Clique em “Vincular”.
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {current.map((cs) => (
                <li
                  key={cs.class_subjects_id}
                  className="rounded-xl border p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{cs.subject.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {cs.subject.description}
                      </div>
                    </div>
                    <Badge variant="flat">
                      ID: {cs.class_subjects_id.slice(0, 6)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <AppAvatar
                      src={cs.subject.teacher.profile_picture?.url}
                      name={cs.subject.teacher.full_name}
                      size="sm"
                    />
                    <div className="text-sm">
                      <div className="font-medium">
                        {cs.subject.teacher.full_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {cs.subject.teacher.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <Button
                      variant="ghost"
                      className="rounded-xl text-destructive hover:text-destructive"
                      onClick={() => onRemove(classId, cs.class_subjects_id)}
                    >
                      <Unlink className="h-4 w-4 mr-2" /> Desvincular
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <AddSubjectToClassDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        classId={classId}
        available={available}
        onConfirm={(ids) => {
          onAdd(classId, ids)
          setDrawerOpen(false)
        }}
      />
    </div>
  )
}
