// components/InstitutionCard.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@heroui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover"
import { Avatar } from "@heroui/avatar"
import {
  MoreVertical,
  MapPin,
  Users,
  BookOpen,
  CalendarDays,
  Clock,
  Pencil,
  Trash2,
  Settings,
} from "lucide-react"

import { EditInstitutionModal } from "./EditInstitutionModal"
import { ConfirmDeleteModal } from "./ConfirmDeleteModal"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatDatePtBR, formatNumber, timeAgo } from "@/lib/format"
import { normalizeFileUrl } from "@/lib/urls"
import { InstitutionSummary } from "@/types/institution"

import { Badge } from "@/components/ui/badge"

type Props = { institution: InstitutionSummary; className?: string }
type Props = { institution: InstitutionSummary; className?: string }

export function InstitutionCard({ institution, className }: Props) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  // Usa o summary atualizado ou os dados da institution
  const finalInstitution = institution

  console.log(finalInstitution)
  

  // URLs finais
  const bannerUrl = normalizeFileUrl(finalInstitution.banner?.url)
  const avatarUrl = normalizeFileUrl(finalInstitution.profilePicture?.url)

  const role = finalInstitution.role
  const members = formatNumber(finalInstitution.active_user_count)
  const created = formatDatePtBR(new Date()) // Não temos created_at no summary
  const lastAct = timeAgo(new Date()) // Não temos last_activity no summary

  // Verifica se o usuário é admin para mostrar opções de edição
  const isAdmin = role === "admin"

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden border-border bg-card shadow-md",
          className
        )}
      >
        {/* Banner */}
        <div className="relative h-44 w-full sm:h-52 md:h-56">
          {bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={`Banner da instituição ${finalInstitution.name}`}
              className="absolute inset-0 h-full w-full object-cover"
              src={bannerUrl}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500" />
          )}
          {/* overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10" />

          {/* badges topo */}
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge>
              {role === "admin"
                ? "Admin"
                : role === "teacher"
                  ? "Professor"
                  : "Estudante"}
            </Badge>
            {finalInstitution.upcoming_event_count > 0 && (
              <Badge>{finalInstitution.upcoming_event_count} evento(s)</Badge>
            )}
          </div>

          {/* menu - só mostra para admins */}
          {isAdmin && (
            <div className="absolute right-3 top-3">
              <Popover
                isOpen={menuOpen}
                placement="left-start"
                onOpenChange={setMenuOpen}
              >
                <PopoverTrigger>
                  <Button
                    isIconOnly
                    className="bg-border opacity-55 backdrop-blur hover:opacity-100"
                    size="sm"
                    variant="flat"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-1">
                  <div className="grid">
                    <Button
                      className="justify-start gap-2"
                      color="warning"
                      variant="light"
                      onPress={() => {
                        setMenuOpen(false)
                        setEditOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" /> Editar instituição
                    </Button>

                    {/* <Button className="justify-start gap-2" variant="light">
                      <Settings className="h-4 w-4" />
                      <Link
                        className="ml-3 hidden text-xs text-muted-foreground underline-offset-2 hover:underline sm:inline"
                        href={`/institutions/${finalInstitution.institution_id}/settings`}
                      >
                        Configurações
                      </Link>
                    </Button> */}

                    <Button
                      className="justify-start gap-2"
                      color="danger"
                      variant="light"
                      onPress={() => {
                        setMenuOpen(false)
                        setDeleteOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" /> Deletar instituição
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Cabeçalho: avatar + textos */}
          <div className="relative -mt-6 mb-6 mqqqqqqqqqqqqqqqqqqqqqqqqb-3 flex items-center gap-4">
            <Avatar
              key={avatarUrl || "no-avatar"}
              showFallback
              alt={finalInstitution.name}
              classNames={{
                base: "rounded-xl ring-2 ring-background shadow-sm bg-muted",
                img: "object-cover",
              }}
              name={finalInstitution.name}
              size="lg"
              src={avatarUrl}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-semibold leading-5">
                  {finalInstitution.name}
                </h3>
              </div>
              <div className="text-xs text-muted-foreground">Instituição</div>
              {finalInstitution.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {finalInstitution.description}
                </p>
              )}
            </div>
          </div>

          {/* Summarry mock */}
          <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            <Info
              icon={<MapPin className="h-3.5 w-3.5" />}
              text={finalInstitution.email}
            />
            <Info
              icon={<Users className="h-3.5 w-3.5" />}
              text={`${members} membros`}
            />
            <Info
              icon={<BookOpen className="h-3.5 w-3.5" />}
              text={`${finalInstitution.upcoming_event_count} eventos`}
            />
            <Info
              icon={<CalendarDays className="h-3.5 w-3.5" />}
              text={`Criada em ${created}`}
            />

            <Info
              className="sm:col-span-2"
              icon={<Clock className="h-3.5 w-3.5" />}
              text={lastAct !== "—" ? lastAct : "Sem atividade recente"}
            />
          </div>

          {/* CTA */}
          <div className="mt-5">
            <Link
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90 sm:w-full"
              href={`/institutions/${finalInstitution.institution_id}`}
            >
              Acessar
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Modais - só renderiza para admins */}
      {isAdmin && (
        <>
          <EditInstitutionModal
            institution={institution}
            isOpen={editOpen}
            onOpenChange={setEditOpen}
            onUpdated={() => {}}
          />
          <ConfirmDeleteModal
            institutionId={finalInstitution.institution_id}
            isOpen={deleteOpen}
            name={finalInstitution.name}
            onDeleted={() => {}}
            onOpenChange={setDeleteOpen}
          />
        </>
      )}
    </>
  )
}

function Info({
  icon,
  text,
  className,
}: {
  icon: React.ReactNode
  text: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-foreground/70">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  )
}
