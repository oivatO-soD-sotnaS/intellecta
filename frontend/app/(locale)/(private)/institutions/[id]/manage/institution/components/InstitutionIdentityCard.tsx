// app/(locale)/(private)/institutions/[id]/manage/institution/components/IdentityCard.tsx
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

type Props = {
  name: string
  email: string
  onEdit?: () => void
}

export default function InstitutionIdentityCard({ name, email, onEdit }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Identidade</CardTitle>
        <Button variant="secondary" onClick={onEdit}>
          <Pencil className="mr-2 size-4" />
          Editar
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <div className="text-xs text-muted-foreground">Nome</div>
          <div className="font-medium">{name}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Email</div>
          <div className="font-medium">{email}</div>
        </div>
      </CardContent>
    </Card>
  )
}
