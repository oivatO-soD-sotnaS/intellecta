"use client"

import { useMemo, useState } from "react"
import { z } from "zod"
import { Send, Loader2, MailPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  useInviteUsersRaw,
  type Role,
} from "@/hooks/invitations/useInviteUsersRaw"
import { toast } from "@heroui/theme"

const emailSchema = z.string().email()

function parseEmails(raw: string) {
  return Array.from(
    new Set(
      raw
        .split(/[\s,;]+/g)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((e) => e.toLowerCase())
    )
  )
}

export default function InviteForm({
  institutionId,
}: {
  institutionId: string
}) {
  const [input, setInput] = useState("")
  const [role, setRole] = useState<Role>("student")
  const emails = useMemo(() => parseEmails(input), [input])

  const { mutateAsync: invite, isPending } = useInviteUsersRaw(institutionId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (emails.length === 0) {
      toast({ title: "Adicione ao menos um e-mail." })
      return
    }

    const invalids = emails.filter((em) => !emailSchema.safeParse(em).success)
    if (invalids.length) {
      toast({
        title: "E-mails inválidos",
        description: `${invalids.slice(0, 5).join(", ")}${invalids.length > 5 ? "..." : ""}`,
      })
      return
    }

    try {
      const invites = emails.map((email) => ({ email, role }))
      const created = await invite(invites)
      toast({ title: `Convites enviados: ${created.length}` })
      setInput("")
    } catch (err: any) {
      let msg = "Falha ao enviar convites."
      if (err?.data) {
        msg =
          err.data?.message ||
          err.data?.error ||
          (typeof err.data === "string" ? err.data : JSON.stringify(err.data))
      } else if (err?.message) {
        msg = err.message
      }
      if (err?.status === 401) msg = "Sessão expirada. Faça login novamente."
      toast({ title: `[${err?.status ?? 500}] ${msg}` })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className={cn(
          "rounded-xl border border-border/60 bg-background p-4 shadow-sm"
        )}
      >
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MailPlus className="h-4 w-4" />
          Cole ou digite e-mails (vírgula, espaço ou quebra de linha)
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ex.: ana@exemplo.com, joao@exemplo.com"
          rows={4}
          className={cn(
            "w-full resize-y rounded-lg border border-input bg-transparent p-3",
            "text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          )}
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {emails.slice(0, 12).map((em) => (
            <span
              key={em}
              className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
            >
              {em}
            </span>
          ))}
          {emails.length > 12 && (
            <span className="text-xs text-muted-foreground">
              +{emails.length - 12}…
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {emails.length} e-mail(s) pronto(s) para enviar
        </span>

        {/* Seletor de papel */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Papel:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className={cn(
              "rounded-md border border-input bg-transparent px-2 py-1 text-sm",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            )}
          >
            <option value="student">student</option>
            <option value="teacher">teacher</option>
            <option value="admin">admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending || emails.length === 0}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium",
            "bg-foreground text-background hover:opacity-95 active:opacity-90",
            "disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Enviar convites
            </>
          )}
        </button>
      </div>
    </form>
  )
}
