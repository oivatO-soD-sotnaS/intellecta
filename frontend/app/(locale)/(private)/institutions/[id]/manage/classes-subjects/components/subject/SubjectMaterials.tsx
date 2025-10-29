"use client"

import { useMemo, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Plus, Pencil, Trash2, Upload } from "lucide-react"
import { Material } from "../types"
import { Badge } from "@heroui/badge"

export default function SubjectMaterials({
  subjectId,
  items,
  onCreate,
  onUpdate,
  onDelete,
}: {
  subjectId: string
  items: Material[]
  onCreate: (m: Material) => void
  onUpdate: (m: Material) => void
  onDelete: (material_id: string) => void
}) {
  const [q, setQ] = useState("")
  const filtered = useMemo(() => {
    const qq = q.toLowerCase()
    return items.filter(
      (x) =>
        x.title.toLowerCase().includes(qq) ||
        x.file.filename.toLowerCase().includes(qq)
    )
  }, [items, q])

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-2 justify-between">
          <Input
            placeholder="Buscar materiais…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="md:max-w-[360px]"
          />
          <CreateMaterialButton subjectId={subjectId} onCreate={onCreate} />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Arquivo</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[1%] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((m) => (
              <TableRow key={m.material_id}>
                <TableCell className="font-medium">{m.title}</TableCell>
                <TableCell>{m.file.filename}</TableCell>
                <TableCell>
                  <Badge variant="flat">
                    {new Date(m.created_at).toLocaleString()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <EditMaterialButton material={m} onUpdate={onUpdate} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-destructive hover:text-destructive"
                    onClick={() => onDelete(m.material_id)}
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
                  Nenhum material encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function CreateMaterialButton({
  subjectId,
  onCreate,
}: {
  subjectId: string
  onCreate: (m: Material) => void
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string>("")
  const [mime, setMime] = useState<string>("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" /> Novo material
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Enviar material (mock)</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid gap-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Arquivo</Label>
            <div className="flex items-center gap-2">
              <Input
                ref={fileRef}
                type="file"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  setFileName(f ? f.name : "")
                  setMime(f ? f.type : "")
                }}
              />
              <Button
                variant="outline"
                type="button"
                className="rounded-xl"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" /> Escolher
              </Button>
            </div>
            {fileName && (
              <div className="text-xs text-muted-foreground">{fileName}</div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            className="rounded-xl"
            onClick={() => {
              if (!title || !fileName) return
              onCreate({
                material_id: `m-${Date.now()}`,
                title,
                created_at: new Date().toISOString(),
                subject_id: subjectId,
                file_id: `f-${Date.now()}`,
                file: {
                  file_id: `f-${Date.now()}`,
                  url: `/files/${fileName}`,
                  filename: fileName,
                  mime_type: mime || "application/octet-stream",
                  size: 0,
                  uploaded_at: new Date().toISOString(),
                },
              })
              setOpen(false)
              setTitle("")
              setFileName("")
              setMime("")
              if (fileRef.current) fileRef.current.value = ""
            }}
          >
            Salvar (mock)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditMaterialButton({
  material,
  onUpdate,
}: {
  material: Material
  onUpdate: (m: Material) => void
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(material.title)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="sm"
        className="rounded-xl mr-2"
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4 mr-2" /> Renomear
      </Button>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Renomear material</DialogTitle>
        </DialogHeader>

        <div className="grid gap-2">
          <Label>Novo título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <DialogFooter>
          <Button
            className="rounded-xl"
            onClick={() => {
              onUpdate({ ...material, title })
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
