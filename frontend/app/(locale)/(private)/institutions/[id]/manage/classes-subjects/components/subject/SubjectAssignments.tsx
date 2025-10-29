"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Assignment } from "../types"
import { Badge } from "@heroui/badge"

export default function SubjectAssignments({
  subjectId,
  items,
  onCreate,
  onUpdate,
  onDelete,
}: {
  subjectId: string
  items: Assignment[]
  onCreate: (a: Assignment) => void
  onUpdate: (a: Assignment) => void
  onDelete: (assignment_id: string) => void
}) {
  const [q, setQ] = useState("")
  const filtered = useMemo(() => {
    const qq = q.toLowerCase()
    return items.filter((x) =>
      [x.title, x.description ?? ""].join(" ").toLowerCase().includes(qq)
    )
  }, [items, q])

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-2 justify-between">
          <Input
            placeholder="Buscar atividades…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="md:max-w-[360px]"
          />
          <CreateAssignmentButton subjectId={subjectId} onCreate={onCreate} />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Anexo</TableHead>
              <TableHead className="w-[1%] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.assignment_id}>
                <TableCell>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.description}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="flat">
                    {new Date(a.deadline).toLocaleString()}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {a.attachment?.filename ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <EditAssignmentButton assignment={a} onUpdate={onUpdate} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-destructive hover:text-destructive"
                    onClick={() => onDelete(a.assignment_id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-sm text-muted-foreground text-center py-8"
                >
                  Nenhuma atividade encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function CreateAssignmentButton({
  subjectId,
  onCreate,
}: {
  subjectId: string
  onCreate: (a: Assignment) => void
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [deadline, setDeadline] = useState<string>("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" /> Nova atividade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Criar atividade</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid gap-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Descrição</Label>
            <Textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Deadline</Label>
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="rounded-xl"
            onClick={() => {
              if (!title || !deadline) return
              onCreate({
                assignment_id: `a-${Date.now()}`,
                title,
                description: desc,
                deadline: new Date(deadline).toISOString(),
                subject_id: subjectId,
              })
              setOpen(false)
              setTitle("")
              setDesc("")
              setDeadline("")
            }}
          >
            Salvar (mock)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditAssignmentButton({
  assignment,
  onUpdate,
}: {
  assignment: Assignment
  onUpdate: (a: Assignment) => void
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(assignment.title)
  const [desc, setDesc] = useState(assignment.description ?? "")
  const [deadline, setDeadline] = useState<string>(
    assignment.deadline
      ? new Date(assignment.deadline).toISOString().slice(0, 16)
      : ""
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="sm"
        className="rounded-xl mr-2"
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4 mr-2" /> Editar
      </Button>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Editar atividade</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid gap-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Descrição</Label>
            <Textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Deadline</Label>
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="rounded-xl"
            onClick={() => {
              onUpdate({
                ...assignment,
                title,
                description: desc,
                deadline: deadline
                  ? new Date(deadline).toISOString()
                  : assignment.deadline,
              })
              setOpen(false)
            }}
          >
            Salvar (mock)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
