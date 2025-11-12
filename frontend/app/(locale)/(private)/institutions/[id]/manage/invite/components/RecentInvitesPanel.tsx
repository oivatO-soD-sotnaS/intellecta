"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@heroui/theme"
import { Clipboard } from "lucide-react"
import type { InviteResponse } from "@/hooks/invitations/useInviteUsersRaw"
import { cn } from "@/lib/utils"

export default function RecentInvitesPanel({
  items,
}: {
  items: InviteResponse[]
}) {
  return (
    <Card className="p-4">
      <div className="mb-2 font-medium">Envios recentes</div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nada por aqui ainda. Envie convites para ver o retorno.
        </p>
      ) : (
        <div className="grid gap-2">
          {items.map((it) => (
            <Card
              key={it.invitation_id}
              className={cn("p-3", "border-border/60")}
            >
              <CardContent className="p-0 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">{it.email}</div>
                  <div className="text-xs text-muted-foreground">
                    role: <span className="font-medium">{it.role}</span> •
                    expira: {it.expires_at}
                  </div>
                </div>
                {/* Exemplo de ação: copiar e-mail (ou link do convite quando tiver) */}
                <button
                  className="inline-flex items-center gap-1 text-xs rounded-md border px-2 py-1 hover:bg-muted"
                  onClick={() => {
                    navigator.clipboard.writeText(it.email)
                    toast({ title: "E-mail copiado" })
                  }}
                >
                  <Clipboard className="h-3.5 w-3.5" />
                  Copiar
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Card>
  )
}
