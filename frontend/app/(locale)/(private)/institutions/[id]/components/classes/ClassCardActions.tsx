"use client"

import * as React from "react"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import type { ClassDTO } from "@/types/class"
import { useDeleteClass } from "@/hooks/classes/mutations"

type Props = {
  institutionId: string
  klass: ClassDTO
  onEdit?: (klass: ClassDTO) => void
  onDeleted?: () => void
  className?: string
}

export default function ClassCardActions({
  institutionId,
  klass,
  onEdit,
  onDeleted,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false)
  const { mutateAsync: deleteClass, isPending } = useDeleteClass(institutionId)

  

  async function handleDelete() {
    try {
      await deleteClass(klass.class_id) // hook espera string
      onDeleted?.()
    } finally {
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm ring-1 ring-border transition hover:bg-background ${className ?? ""}`}
          aria-label="Mais ações"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent side="bottom" align="end" className="w-44 p-1">
        <div className="flex flex-col">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-accent"
            onClick={() => {
              onEdit?.(klass) 
              setOpen(false)
            }}
          >
            <Pencil className="h-4 w-4" />
            Editar turma
          </button>

          <div className="my-1 h-px bg-border" />

          <button
            type="button"
            className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4" />
            {isPending ? "Excluindo..." : "Excluir turma"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
