// app/(locale)/(private)/institutions/[id]/manage/people/components/InviteForm.tsx
"use client"

import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { addDays } from "date-fns"
import type { Invitation } from "./types"

type Props = {
  institutionId: string
  onCreated: (newInvites: Invitation[]) => void
}

export default function InviteForm({ institutionId, onCreated }: Props) {
  const [emails, setEmails] = useState("")
  const [role, setRole] = useState<"admin" | "professor" | "aluno">("aluno")
  const [days, setDays] = useState<number>(7)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = emails
      .split(/[\n,; ]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    if (!parsed.length) return

    const expires_at = addDays(new Date(), days).toISOString()
    const newInvites: Invitation[] = parsed.map((email, idx) => ({
      invitation_id: `mock-${Date.now()}-${idx}`,
      email,
      role,
      created_at: new Date().toISOString(),
      expires_at,
      accepted_at: null,
      institution_id: institutionId,
      invited_by: "current-user",
    }))

    onCreated(newInvites)
    setEmails("")
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Convidar pessoas</CardTitle>
        <CardDescription>
          Envie múltiplos e-mails de uma vez. Você pode ajustar o papel padrão e
          a validade.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>
              E-mails (separe por vírgula, espaço ou quebra de linha)
            </Label>
            <Textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="maria@exemplo.com, joao@exemplo.com"
              className="resize-y min-h-[84px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Papel padrão</Label>
              <Select value={role} onValueChange={(v: any) => setRole(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aluno">Aluno</SelectItem>
                  <SelectItem value="professor">Professor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Validade (dias)</Label>
              <Select
                value={String(days)}
                onValueChange={(v) => setDays(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="7" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 3, 7, 14, 30].map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="rounded-xl">
              Enviar convites
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setEmails("")}
            >
              Limpar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
