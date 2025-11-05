// app/(locale)/(private)/institutions/[id]/manage/institution/components/DangerZoneCard.tsx
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

type Props = { onDelete?: () => void }

export default function InstitutionDangerZoneCard({ onDelete }: Props) {
  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive">Zona de perigo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Excluir a instituição é uma ação permanente e não pode ser desfeita.
        </p>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="mr-2 size-4" />
          Excluir instituição
        </Button>
      </CardContent>
    </Card>
  )
}
