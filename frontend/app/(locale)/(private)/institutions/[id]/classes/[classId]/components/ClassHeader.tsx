// app/(locale)/(private)/institutions/[institution_id]/classes/[class_id]/_components/ClassHeader.tsx
"use client"

import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import type { ClassDTO } from "@/types/class"
import { Badge } from "@/components/ui/badge"

interface ClassHeaderProps {
  institutionId: string
  classData?: ClassDTO
  isLoading?: boolean
}

export function ClassHeader({
  institutionId,
  classData,
  isLoading,
}: ClassHeaderProps) {
  if (isLoading) {
    return (
      <section className="mb-6 overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <Skeleton className="h-28 w-full sm:h-32" />
        <div className="flex items-center gap-4 px-5 pb-4 pt-3 sm:px-6 sm:pb-5">
          <Skeleton className="h-14 w-14 rounded-xl sm:h-16 sm:w-16" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </section>
    )
  }

  if (!classData) return null

  const { class_id, name, description, banner, profile_picture } = classData

  // Banner pode vir como objeto de arquivo ou string
  const bannerUrl =
    typeof banner === "object"
      ? (banner as any)?.url
      : (banner as any) || undefined

  // Avatar idem
  const avatarUrl =
    typeof profile_picture === "object"
      ? (profile_picture as any)?.url
      : (profile_picture as any) || undefined

  const initials =
    name
      ?.split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "T"

  return (
    <section className="mb-6 overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      {/* Banner */}
      <div className="relative h-28 w-full sm:h-32">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt={`Banner da turma ${name}`}
            fill
            unoptimized // importante pra não passar pelo /_next/image
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400" />
        )}

        {/* overlay pra leitura do texto */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/10" />
      </div>

      {/* Conteúdo */}
      <div className="flex items-center gap-4 px-5 pb-4 pt-3 sm:px-6 sm:pb-5">
        {/* Avatar da turma */}
        <div className="relative -mt-10 h-14 w-14 shrink-0 rounded-xl border border-border/70 bg-background shadow-sm sm:h-16 sm:w-16">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`Avatar da turma ${name}`}
              fill
              unoptimized
              sizes="64px"
              className="rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-emerald-50 text-sm font-semibold text-emerald-700">
              {initials}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-base font-semibold sm:text-lg">
              {name || "Turma sem nome"}
            </h1>
            <Badge
              className="rounded-full border border-emerald-100 bg-emerald-50 text-[0.65rem] font-semibold text-emerald-700"
            >
              Turma selecionada
            </Badge>
          </div>

          {description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
              {description}
            </p>
          )}

          <p className="mt-1 text-[0.7rem] text-muted-foreground">
            ID da turma:{" "}
            <span className="font-mono text-[0.68rem]">{class_id}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
