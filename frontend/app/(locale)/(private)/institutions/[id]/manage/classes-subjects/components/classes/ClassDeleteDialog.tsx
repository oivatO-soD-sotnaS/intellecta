// app/(locale)/(private)/institutions/[id]/manage/classes-subjects/components/ClassDeleteDialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  onConfirm: () => void
  submitting?: boolean
}

export default function ClassDeleteDialog({
  open,
  onOpenChange,
  name,
  onConfirm,
  submitting,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remover turma</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover a turma{" "}
            <span className="font-medium text-foreground">
              {name || "(sem nome)"}
            </span>
            ? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={submitting}
          >
            {submitting ? "Removendo..." : "Remover"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
