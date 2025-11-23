// app/(locale)/(private)/institutions/[id]/manage/people/_components/EmptyState.tsx
"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EmptyState({
  institutionId,
  onInviteClick
}: {
  institutionId: string,
  onInviteClick?: () => void
}) {
  const router = useRouter()

  const handleInviteClick = () => {
    if (onInviteClick) {
      onInviteClick()
    } else {
      router.push(`/institutions/${institutionId}/manage/invite`)
    }
  }

  return (
    <Card className="p-8 text-center space-y-3">
      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <UserPlus2 className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">Nenhum membro ainda</h3>
      <p className="text-sm text-muted-foreground">
        Convide pessoas para começar a montar sua instituição.
      </p>
      <Button onClick={handleInviteClick}>
        Convidar pessoas
      </Button>
    </Card>
  )
}