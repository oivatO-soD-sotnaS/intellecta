"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import type { ClassUser } from "./types"
import { Badge } from "@heroui/badge"
import AppAvatar from "@/app/(locale)/(private)/components/AppAvatar"


export default function UserDetailsSheet({
  open,
  onOpenChange,
  classUser,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  classUser: ClassUser | null
}) {
  if (!classUser) return null
  const initials = classUser.user.full_name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[460px]">
        <SheetHeader>
          <SheetTitle>Detalhes do membro</SheetTitle>
          <SheetDescription>
            Informações básicas do usuário na turma
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <AppAvatar
              src={classUser.user.profile_picture?.url}
              name={classUser.user.full_name}
              size="lg" 
              radius="full" 
            />
            <div>
              <div className="font-medium">{classUser.user.full_name}</div>
              <div className="text-xs text-muted-foreground">
                {classUser.user.email}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Papel</div>
              <Badge variant="flat" className="capitalize">
                {classUser.role}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">ID associação</div>
              <div className="font-mono text-xs">
                {classUser.class_users_id}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
