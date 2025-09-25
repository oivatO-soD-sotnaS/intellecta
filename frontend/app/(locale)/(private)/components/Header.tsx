// app/(locale)/(private)/components/Header.tsx
"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import NotificationsBell from "./NotificationsBell"
import SearchBar from "./SearchBar"
import UserMenu, { type HeaderUser } from "./UserMenu"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser" 

type HeaderProps = {
  leftSlot?: ReactNode
  className?: string
}

export default function Header({ leftSlot, className }: HeaderProps) {
  const { data: me } = useCurrentUser() 

  const user: HeaderUser = {
    name: me?.full_name ?? me?.email?.split("@")[0] ?? "Usuário",
    email: me?.email ?? "",
    // avatarUrl: (me as any)?.profile_picture_url ?? (me as any)?.image ?? undefined,
    avatarUrl: me?.profile_picture ?? undefined,
  }

  console.log("User avatar URL:", user.avatarUrl);

  

  return (
    <header
      role="banner"
      className={cn(
        "sticky top-0 z-40 w-full border-b backdrop-blur bg-white/80 supports-[backdrop-filter]:bg-white/60 dark:bg-neutral-900/70",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:px-4">
        <div className="flex items-center gap-2">
          {leftSlot ? <div className="md:hidden">{leftSlot}</div> : null}

          <Link
            href="/"
            aria-label="Ir para a página inicial"
            className="hidden items-center gap-2 md:flex"
          >
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold tracking-tight">
              Intellecta
            </span>
          </Link>
        </div>

        <div className="flex-1 hidden md:flex">
          <div className="w-full max-w-xl mx-auto">
            <SearchBar placeholder="Buscar disciplinas, materiais, atividades…" />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <NotificationsBell />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  )
}
