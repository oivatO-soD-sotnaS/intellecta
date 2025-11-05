// app/(locale)/(private)/institutions/[id]/manage/institution/components/AboutCard.tsx
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

type Props = {
  description: string
  onEdit?: () => void
}

export default function InstitutionAboutCard({ description, onEdit }: Props) {
  const [expanded, setExpanded] = React.useState(false)
  const isLong = (description ?? "").length > 260

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sobre</CardTitle>
        <Button variant="secondary" onClick={onEdit}>
          <Pencil className="mr-2 size-4" />
          Editar
        </Button>
      </CardHeader>
      <CardContent>
        <p className={expanded ? "" : "line-clamp-4 text-balance"}>
          {description || "Sem descrição."}
        </p>
        {isLong && (
          <Button
            variant="link"
            className="px-0"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Ver menos" : "Ver mais"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
