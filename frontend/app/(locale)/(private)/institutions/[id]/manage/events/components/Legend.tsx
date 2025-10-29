"use client"

import { Badge } from "@heroui/badge"



const PALETTE: Record<string, string> = {
  feriado: "violet",
  reuniao: "sky",
  prova: "rose",
  aviso: "amber",
  outros: "emerald",
}

export default function Legend() {
  const items = Object.entries(PALETTE)

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-muted-foreground">Legenda</div>
      <div className="flex flex-wrap gap-2">
        {items.map(([k, v]) => (
          <Badge
            key={k}
            variant="solid"
            color="success"
            className={`capitalize bg-${v}-100 text-${v}-900 dark:bg-${v}-900/30 dark:text-${v}-200`}
          >
            {k}
          </Badge>
        ))}
      </div>
    </div>
  )
}
