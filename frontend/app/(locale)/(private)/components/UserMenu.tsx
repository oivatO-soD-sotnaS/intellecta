"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@heroui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover"
import { Avatar } from "@heroui/avatar"
import { ChevronDown } from "lucide-react"
import { useSignOut } from "@/hooks/auth/useSignOut"
import { useProfileForm } from "@/hooks/useProfileForm"


// interface ProfileCardProps {
//   name: string
//   role?: string
//   institutionsCount?: number
//   disciplinesCount?: number
//   avatarUrl?: string
//   avatarId?: string
// }

export type HeaderUser = {
  name: string
  email: string
  avatarUrl?: string
  avatarId?: string
}



export default function UserMenu({
  user,
  onSignOut,
}: {
  user: HeaderUser
  onSignOut?: () => void
}) {
  const { mutate: signOut, isPending } = useSignOut()

  const { profilePictureId, profilePictureUrl } = useProfileForm()

  const src =
    profilePictureUrl ??
    (profilePictureId ? `/api/files/${profilePictureId}` : undefined) ??
   user.avatarUrl ??
    (user.avatarId ? `/api/files/${user.avatarId}` : undefined)


  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button variant="flat" radius="lg" className="flex items-center gap-2">
          <Avatar alt={user?.name ?? "Usuário"} size="sm" src={src || "#"} />
          <span className="hidden text-sm sm:inline">
            {user?.name || "Usuário"}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-56">
        <div className="mb-3 flex items-center gap-2">
          <Avatar
            alt={user?.name ?? "Usuário"}
            size="md"
            src={src || "#"}
            className="shrink-0" 
          />
          <div className="min-w-0 flex-1">

            <p className="truncate font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground block">
              {user?.email}
            </p>
          </div>
        </div>

        <ul className="space-y-1">
          <li>
            <Link href="/profile">
              <Button as="span" className="w-full justify-start" variant="flat">
                Meu Perfil
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <Button as="span" className="w-full justify-start" variant="flat">
                Configurações
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/help">
              <Button as="span" className="w-full justify-start" variant="flat">
                Ajuda
              </Button>
            </Link>
          </li>
          <li>
            <Button
              className="w-full justify-start text-danger"
              variant="flat"
              onPress={() => signOut()}
              isLoading={isPending}
            >
              {isPending ? "Saindo..." : "Sair"}
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}
