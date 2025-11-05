// app/(locale)/(private)/institutions/[id]/manage/institution/components/HeaderHero.tsx
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Camera, Pencil } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Avatar } from "@heroui/avatar"

type Props = {
  name: string
  email: string
  bannerUrl?: string
  logoUrl?: string
  onEditClick?: () => void
  onScrollToMedia?: () => void
  className?: string
}

export default function InstitutionHeaderHero({
  name,
  email,
  bannerUrl,
  logoUrl,
  onEditClick,
  onScrollToMedia,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-background",
        className
      )}
    >
      <div className="relative h-48 w-full">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt=""
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-pink-500/20" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(transparent,rgba(0,0,0,.4))]" />
      </div>

      <div className="flex items-end gap-4 px-6 -mt-10 pb-4">
        <div className="relative">
          <Avatar
            src={logoUrl}
            name={name}
            className="size-20 ring-4 ring-background shadow-md"
          />
          <button
            type="button"
            onClick={onScrollToMedia}
            className="absolute -bottom-2 -right-2 inline-flex items-center justify-center rounded-full border bg-background p-2 shadow hover:scale-105 transition-transform"
            aria-label="Alterar imagens"
            title="Alterar imagens"
          >
            <Camera className="size-4" />
          </button>
        </div>

        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-semibold">{name}</h1>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="secondary" onClick={onEditClick}>
            <Pencil className="mr-2 size-4" />
            Editar identidade
          </Button>
        </div>
      </div>
    </div>
  )
}
