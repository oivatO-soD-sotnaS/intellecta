// app/(locale)/(private)/invites/components/InviteCard.tsx
"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import type { InvitationDTO } from "@/types/invitation"
import { Button } from "@heroui/button"
import { Chip } from "@heroui/chip"
import { Tooltip } from "@heroui/tooltip"
import { Building2, Clock, Mail, Shield } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

type Props = {
  invitation: InvitationDTO
  /** Se true, aplica um destaque visual extra (usado para o convite vindo do e-mail) */
  highlighted?: boolean
  /** Se true, exibe como expirado, mesmo que o acceptedAt esteja vazio */
  expired?: boolean
  /** Desabilita ações (usado para convites aceitos ou apenas para exibição) */
  disabled?: boolean
  /** Indica se alguma ação de aceite está em andamento (global ou por card) */
  isAccepting?: boolean
  /** Callback para aceitar o convite */
  onAccept?: (invitation: InvitationDTO) => void | Promise<void>
}

function computeStatus(invitation: InvitationDTO, forcedExpired?: boolean) {
  const now = new Date()
  const exp = new Date(invitation.expiresAt)

  if (forcedExpired) return "expired" as const
  if (invitation.acceptedAt) return "accepted" as const
  if (exp < now) return "expired" as const
  return "pending" as const
}

function statusChip(status: "pending" | "accepted" | "expired") {
  switch (status) {
    case "pending":
      return (
        <Chip size="sm" variant="flat" color="primary" className="font-medium">
          Pendente
        </Chip>
      )
    case "accepted":
      return (
        <Chip size="sm" variant="flat" color="success" className="font-medium">
          Aceito
        </Chip>
      )
    case "expired":
      return (
        <Chip size="sm" variant="flat" color="warning" className="font-medium">
          Expirado
        </Chip>
      )
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function InviteCard({
  invitation,
  highlighted,
  expired,
  disabled,
  isAccepting,
  onAccept,
}: Props) {
  const status = useMemo(
    () => computeStatus(invitation, expired),
    [invitation, expired]
  )

  const isActionDisabled =
    disabled || status !== "pending" || isAccepting || !onAccept

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={highlighted ? "relative" : undefined}
    >
      {highlighted && (
        <div className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary-500/60 via-primary-400/40 to-emerald-400/50 opacity-70 blur-[14px]" />
      )}

      <Card
        className={`relative z-[1] h-full rounded-2xl border border-default-200/70 bg-background/80 shadow-sm backdrop-blur-sm dark:border-default-100/40 ${
          highlighted
            ? "border-primary-500/60 shadow-[0_0_0_1px_rgba(59,130,246,0.35)]"
            : ""
        }`}
      >
        <CardHeader className="flex items-start gap-3 px-4 pb-2 pt-4 sm:px-5 sm:pt-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-200">
            <Building2 className="h-5 w-5" />
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="max-w-xs truncate text-base font-semibold sm:max-w-sm sm:text-lg">
                {invitation.institutionName}
              </h3>
              <div className="flex items-center gap-2">
                {statusChip(status)}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-foreground-500 sm:text-xs">
              <span className="inline-flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>
                  Papel:
                  <span className="ml-1 font-medium capitalize">
                    {invitation.role === "student"
                      ? "Aluno"
                      : invitation.role === "teacher"
                        ? "Professor"
                        : "Administrador"}
                  </span>
                </span>
              </span>

              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span className="truncate">{invitation.email}</span>
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 px-4 pb-2 pt-1 text-sm text-foreground-500 sm:px-5">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Clock className="h-4 w-4 shrink-0 text-foreground-400" />
            {status === "expired" ? (
              <span>
                Convite expirado em{" "}
                <span className="font-medium">
                  {formatDate(invitation.expiresAt)}
                </span>
              </span>
            ) : status === "accepted" ? (
              <span>
                Convite aceito em{" "}
                <span className="font-medium">
                  {invitation.acceptedAt
                    ? formatDate(invitation.acceptedAt)
                    : "-"}
                </span>
              </span>
            ) : (
              <span>
                Expira em{" "}
                <span className="font-medium">
                  {formatDate(invitation.expiresAt)}
                </span>
              </span>
            )}
          </div>

          {highlighted && status === "pending" && (
            <p className="text-xs text-primary-600 dark:text-primary-300">
              Este é o convite que você abriu diretamente a partir do e-mail.
              Confirme se reconhece a instituição antes de aceitar.
            </p>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3 px-4 pb-4 pt-2 sm:px-5 sm:pb-5">
          <div className="flex flex-1 flex-col text-[11px] text-foreground-400 sm:text-xs">
            {status === "pending" && (
              <span>
                Ao aceitar, você será adicionado à instituição e poderá acessar
                suas turmas, disciplinas e eventos.
              </span>
            )}
            {status === "accepted" && (
              <span>Você já faz parte desta instituição.</span>
            )}
            {status === "expired" && (
              <span>
                Este convite não é mais válido. Solicite um novo convite ao
                administrador da instituição.
              </span>
            )}
          </div>

          <Tooltip
            content={
              isActionDisabled
                ? status === "pending"
                  ? "Ação indisponível no momento."
                  : "Convite não está mais disponível para aceite."
                : "Aceitar convite"
            }
            placement="top"
          >
            <Button
              size="sm"
              color={highlighted ? "primary" : "default"}
              variant={highlighted ? "solid" : "flat"}
              isDisabled={isActionDisabled}
              isLoading={!!isAccepting && !disabled}
              onPress={() => onAccept?.(invitation)}
              className="whitespace-nowrap"
            >
              {status === "pending"
                ? "Aceitar convite"
                : status === "accepted"
                  ? "Já aceito"
                  : "Expirado"}
            </Button>
          </Tooltip>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
