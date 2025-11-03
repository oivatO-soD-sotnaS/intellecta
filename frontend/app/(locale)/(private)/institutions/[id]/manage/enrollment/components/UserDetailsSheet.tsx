"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet" // ajuste se seu Sheet for de outra lib
import { Avatar } from "@heroui/avatar"

type UserLite = {
  user_id: string
  full_name?: string
  email?: string
  profile_picture?: { url?: string } | null
}

export default function UserDetailsSheet({
  open,
  onOpenChange,
  user,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserLite | null
}) {
  const name = user?.full_name || user?.user_id || "Usuário"
  const email = user?.email ?? ""
  const ava = user?.profile_picture?.url

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Detalhes do usuário</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex items-center gap-3">
          {ava ? (
            <Avatar src={ava} className="h-12 w-12" />
          ) : (
            <Avatar className="h-12 w-12">
              {(name || "U")
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </Avatar>
          )}
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {email}
            </span>
          </div>
        </div>

        {/* Espaço para futuros detalhes (ex.: data de entrada na turma, papeis, etc.) */}
        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
          <p>ID do usuário: {user?.user_id ?? "-"}</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
