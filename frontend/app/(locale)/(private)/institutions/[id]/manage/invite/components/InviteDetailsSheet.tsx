// app/(locale)/(private)/institutions/[id]/manage/people/components/InviteDetailsSheet.tsx
"use client"

import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import type { Invitation } from "./types"
import { Badge } from "@heroui/badge"

export default function InviteDetailsSheet({
  open,
  onOpenChange,
  invitation,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  invitation: Invitation | null
}) {
  if (!invitation) return null
  const accepted = !!invitation.accepted_at
  const expired = new Date(invitation.expires_at) <= new Date()
  const status = accepted ? "Aceito" : expired ? "Expirado" : "Pendente"
  const tone = accepted ? "default" : expired ? "destructive" : "secondary"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[520px]">
        <SheetHeader>
          <SheetTitle>Convite para {invitation.email}</SheetTitle>
          <SheetDescription>
            Detalhes do convite e da instituição
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {invitation.institution?.banner?.url && (
            <div className="relative h-28 w-full overflow-hidden rounded-xl">
              <Image
                src={invitation.institution.banner.url}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            {invitation.invited_by_user?.profile_picture?.url ? (
              <Image
                src={invitation.invited_by_user.profile_picture.url}
                alt=""
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-muted" />
            )}
            <div>
              <div className="font-medium">
                {invitation.invited_by_user?.full_name ?? "—"}
              </div>
              <div className="text-xs text-muted-foreground">
                {invitation.invited_by_user?.email ?? "—"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Papel</div>
              <Badge variant="flat">{invitation.role}</Badge>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Status</div>
              <Badge variant={tone as any}>{status}</Badge>
            </div>
            <div className="space-y-1 col-span-2">
              <div className="text-muted-foreground">Instituição</div>
              <div className="font-medium">
                {invitation.institution?.name ?? "—"}
              </div>
              <div className="text-xs text-muted-foreground">
                {invitation.institution?.email ?? ""}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
