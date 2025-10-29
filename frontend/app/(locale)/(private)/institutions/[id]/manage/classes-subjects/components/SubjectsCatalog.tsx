"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { Plus, Copy, Pencil, Trash2, Search } from "lucide-react"
import type { Subject } from "./types"
import { Badge } from "@heroui/badge"
import AppAvatar from "@/app/(locale)/(private)/components/AppAvatar"
import Link from "next/link"

export default function SubjectsCatalog({
  subjects,
  onCreate,
  onUpdate,
  onDelete,
  institutionId,
}: {
  institutionId: string
  subjects: Subject[]
  onCreate: (s: Subject) => void
  onUpdate: (s: Subject) => void
  onDelete: (subject_id: string) => void
}) {
  const [q, setQ] = useState("")
  const [teacher, setTeacher] = useState<string | "all">("all")

  const teachers = useMemo(() => {
    const set = new Map<string, string>()
    subjects.forEach((s) => set.set(s.teacher.user_id, s.teacher.full_name))
    return Array.from(set, ([id, name]) => ({ id, name }))
  }, [subjects])

  const filtered = useMemo(() => {
    let base = [...subjects]
    if (teacher !== "all")
      base = base.filter((s) => s.teacher.user_id === teacher)
    if (q.trim()) {
      const qq = q.toLowerCase()
      base = base.filter((s) =>
        [s.name, s.description, s.teacher.full_name]
          .join(" ")
          .toLowerCase()
          .includes(qq)
      )
    }
    return base
  }, [subjects, q, teacher])

  const duplicate = (s: Subject) => {
    const copy: Subject = {
      ...s,
      subject_id: `copy-${s.subject_id}-${Date.now()}`,
      name: `${s.name} (cópia)`,
    }
    onCreate(copy)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, descrição ou professor…"
            className="pl-8"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="h-9 rounded-lg border bg-background px-3 text-sm"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value as any)}
          >
            <option value="all">Todos os professores</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <Button
            className="rounded-xl"
            onClick={() => duplicate(filtered[0] ?? subjects[0])}
            disabled={!subjects.length}
          >
            <Copy className="h-4 w-4 mr-2" /> Duplicar qualquer
          </Button>
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <Card key={s.subject_id} className="overflow-hidden rounded-2xl">
            <div className="h-28 w-full bg-muted/40">
              {s.banner ? (
                <img
                  src={s.banner}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-semibold">{s.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {s.description}
                  </div>
                </div>
                <Badge variant="flat">ID: {s.subject_id.slice(0, 6)}</Badge>

                <Link
                  href={`/institutions/${institutionId}/manage/classes-subjects/subjects/${s.subject_id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Abrir
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <AppAvatar
                  src={s.teacher.profile_picture?.url}
                  name={s.teacher.full_name}
                  size="sm"
                />
                <div className="text-sm">
                  <div className="font-medium">{s.teacher.full_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.teacher.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Pencil className="h-4 w-4 mr-2" /> Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => duplicate(s)}
                >
                  <Copy className="h-4 w-4 mr-2" /> Duplicar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-destructive hover:text-destructive"
                  onClick={() => onDelete(s.subject_id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-sm text-muted-foreground py-10 text-center">
          Nenhuma disciplina encontrada.
        </div>
      )}
    </div>
  )
}
