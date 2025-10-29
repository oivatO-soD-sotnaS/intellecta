"use client"

import { useMemo, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import type { Subject } from "./types"
import { Badge } from "@heroui/badge"
import AppAvatar from "@/app/(locale)/(private)/components/AppAvatar"

export default function AddSubjectToClassDrawer({
  open,
  onOpenChange,
  classId,
  available,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  classId: string
  available: Subject[]
  onConfirm: (subject_ids: string[]) => void
}) {
  const [q, setQ] = useState("")
  const [sel, setSel] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => {
    if (!q.trim()) return available
    const qq = q.toLowerCase()
    return available.filter((s) =>
      [s.name, s.description, s.teacher.full_name]
        .join(" ")
        .toLowerCase()
        .includes(qq)
    )
  }, [q, available])

  const ids = useMemo(() => Object.keys(sel).filter((k) => sel[k]), [sel])
  const toggle = (id: string) => setSel((p) => ({ ...p, [id]: !p[id] }))
  const clear = () => setSel({})

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[560px]">
        <SheetHeader>
          <SheetTitle>Vincular disciplinas</SheetTitle>
          <SheetDescription>
            Selecione do catálogo as disciplinas para a turma atual.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Buscar no catálogo…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="text-xs text-muted-foreground">
            Turma: <Badge variant="flat">{classId}</Badge>
          </div>

          <div className="border rounded-xl max-h-[420px] overflow-auto">
            {filtered.length === 0 ? (
              <div className="text-sm text-muted-foreground p-4">
                Nada encontrado.
              </div>
            ) : (
              <ul className="divide-y">
                {filtered.map((s) => (
                  <li key={s.subject_id} className="p-3 flex items-start gap-3">
                    <Checkbox
                      checked={!!sel[s.subject_id]}
                      onCheckedChange={() => toggle(s.subject_id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {s.description}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <AppAvatar
                          src={s.teacher.profile_picture?.url}
                          name={s.teacher.full_name}
                          size="sm"
                        />
                        <div className="text-xs">
                          <div className="font-medium">
                            {s.teacher.full_name}
                          </div>
                          <div className="text-muted-foreground">
                            {s.teacher.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge variant="flat">
                      ID {s.subject_id.slice(0, 6)}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-sm text-muted-foreground">
              {ids.length} selecionada(s)
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-xl" onClick={clear}>
                Limpar
              </Button>
              <Button
                className="rounded-xl"
                disabled={ids.length === 0}
                onClick={() => onConfirm(ids)}
              >
                Vincular
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
