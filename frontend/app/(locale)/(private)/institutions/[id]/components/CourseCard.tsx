"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import type { ClassDTO } from "@/types/class"
import ClassCardActions from "./classes/ClassCardActions"

type Props = {
  klass: ClassDTO
  onOpen?: (klass: ClassDTO) => void

  /** mostra o menu só para administradores */
  canManage?: boolean
  /** necessário para excluir via hook */
  institutionId: string
  /** abre o modal de edição no pai */
  onEditClass?: (klass: ClassDTO) => void
  /** refetch no pai após excluir */
  onDeleted?: () => void
}

export default function CourseCard({
  klass,
  onOpen,
  canManage = true,
  institutionId,
  onEditClass,
  onDeleted,
}: Props) {
  const bannerUrl = klass.banner?.url ?? null
  const avatarUrl = klass.profile_picture?.url ?? null

  

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Capa */}
      <div
        className="h-20 w-full bg-gradient-to-r from-green-600 to-emerald-500"
        style={
          bannerUrl
            ? {
                backgroundImage: `url('${bannerUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
        aria-hidden
      />

      {/* 3 pontinhos */}
      {canManage && (
        <div className="absolute right-2 top-2 z-20">
          <ClassCardActions
            institutionId={institutionId}
            klass={klass}
            onEdit={onEditClass} // <- repassa para o pai
            onDeleted={onDeleted}
          />
        </div>
      )}

      {/* Corpo */}
      <div className="p-5">
        {/* Header com avatar + nome da classe */}
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 shrink-0 select-none items-center justify-center overflow-hidden rounded-xl bg-muted ring-1 ring-border">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={klass.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-semibold text-foreground/80">
                {getInitials(klass.name)}
              </span>
            )}
          </div>

          <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-foreground">
            {klass.name}
          </h3>
        </div>

        {/* Descrição curta */}
        {klass.description && (
          <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
            {klass.description}
          </p>
        )}

        {/* Ações */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => onOpen?.(klass)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition hover:shadow-sm active:scale-[0.99] cursor-pointer"
          >
            Abrir turma
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Glow sutil ao hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -inset-20 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.12),transparent_60%)]" />
      </div>
    </motion.article>
  )
}

function getInitials(text: string) {
  return text
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((t) => t[0]?.toUpperCase())
    .join("")
}
