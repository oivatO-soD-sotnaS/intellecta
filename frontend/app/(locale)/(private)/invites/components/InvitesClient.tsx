// app/(locale)/(private)/invites/components/InvitesClient.tsx
"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useInvitations } from "@/hooks/invitations/useInvitations"
import { useAcceptInvitation } from "@/hooks/invitations/useAcceptInvitation"
import type { InvitationDTO } from "@/types/invitation"
import { addToast } from "@heroui/toast"
import { Spinner } from "@heroui/spinner"
import { Button } from "@heroui/button"
import { Chip } from "@heroui/chip"
import { InviteCard } from "./InviteCard"
import { IoWarningOutline } from "react-icons/io5"


type Props = {
  /** Token vindo do link de convite via e-mail (?token=...) */
  invitationToken?: string
}

function getStatus(
  invitation: InvitationDTO
): "pending" | "accepted" | "expired" {
  const now = new Date()
  const exp = new Date(invitation.expiresAt)

  if (invitation.acceptedAt) return "accepted"
  if (exp < now) return "expired"
  return "pending"
}

export default function InvitesClient({ invitationToken }: Props) {
  const router = useRouter()
  const { data, isLoading, isError } = useInvitations()
  const { mutateAsync: acceptInvitation, isPending: isAccepting } =
    useAcceptInvitation()

  const invitations = data ?? []

  const pending = useMemo(
    () => invitations.filter((inv) => getStatus(inv) === "pending"),
    [invitations]
  )

  const accepted = useMemo(
    () => invitations.filter((inv) => getStatus(inv) === "accepted"),
    [invitations]
  )

  const expired = useMemo(
    () => invitations.filter((inv) => getStatus(inv) === "expired"),
    [invitations]
  )

  const highlightedInvitation = useMemo(
    () =>
      invitationToken
        ? invitations.find((inv) => inv.id === invitationToken)
        : undefined,
    [invitationToken, invitations]
  )

  async function handleAccept(invitation: InvitationDTO) {
    try {
      const res: any = await acceptInvitation(invitation.id)

      addToast({
        title: "Convite aceito com sucesso",
        description: `Você agora faz parte de ${invitation.institutionName}.`,
        color: "success",
      })

      // Se a API devolver o id da instituição, redireciona para ela
      if (res?.institutionId) {
        router.push(`/institutions/${res.institutionId}`)
      } else {
        router.push("/home")
      }
    } catch (error: any) {
      console.error(error)
      addToast({
        title: "Não foi possível aceitar o convite",
        description:
          error?.message ??
          "Tente novamente em alguns instantes ou verifique se o convite ainda é válido.",
        color: "danger",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-foreground-500">
          Carregando seus convites...
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1>
          <IoWarningOutline color="red" size={35}/>
        </h1>
        <p className="text-lg font-semibold text-danger-500">
          Ocorreu um erro ao carregar seus convites.
        </p>
        <p className="max-w-md text-center text-sm text-foreground-500">
          Atualize a página ou tente novamente mais tarde. Se o problema
          persistir, entre em contato com o suporte da plataforma.
        </p>
        <Button variant="flat" onPress={() => router.refresh()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  const hasAny = invitations.length > 0

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      {/* Cabeçalho animado */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, easing: "ease-out" }}
        className="flex flex-col gap-3"
      >
        <div className="inline-flex items-center gap-2 self-start rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
          <span>Central de convites</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Seus convites para instituições
        </h1>
        <p className="max-w-2xl text-sm text-foreground-500 sm:text-base">
          Veja todos os convites que você recebeu para participar de
          instituições, turmas e disciplinas na plataforma Intellecta. Aceite
          para ingressar imediatamente ou ignore caso não reconheça o convite.
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-500 sm:text-sm">
          <Chip
            size="sm"
            startContent={""}
            variant="flat"
          >
            {pending.length} pendente(s)
          </Chip>
          <Chip size="sm" variant="flat" color="success">
            {accepted.length} aceito(s)
          </Chip>
          <Chip size="sm" variant="flat" color="warning">
            {expired.length} expirado(s)
          </Chip>
        </div>
      </motion.div>

      {/* Destaque para convite vindo via token */}
      {invitationToken && highlightedInvitation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, easing: "ease-out" }}
          className="rounded-2xl border border-primary-200 bg-primary-50/70 p-4 shadow-sm dark:border-primary-700/60 dark:bg-primary-950/40"
        >
          <div className="mb-3 flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">
              Convite aberto a partir do e-mail
            </p>
          </div>
          <InviteCard
            invitation={highlightedInvitation}
            onAccept={handleAccept}
            isAccepting={isAccepting}
            highlighted
          />
        </motion.div>
      )}

      {/* Estado sem convites */}
      {!hasAny && !invitationToken && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, easing: "ease-out" }}
          className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-default-100 shadow-inner">
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">
              Você ainda não possui convites
            </h2>
            <p className="max-w-md text-sm text-foreground-500">
              Quando um administrador de instituição enviar um convite para seu
              e-mail, ele aparecerá aqui. Fique de olho na sua caixa de entrada!
            </p>
          </div>
          <Button variant="flat" onPress={() => router.push("/home")}>
            Voltar para a página inicial
          </Button>
        </motion.div>
      )}

      {/* Lista de convites pendentes */}
      {pending.length > 0 && (
        <section className="space-y-3">
          <motion.h2
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, easing: "ease-out" }}
            className="text-sm font-semibold uppercase tracking-wide text-foreground-500"
          >
            Convites pendentes
          </motion.h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pending.map((invitation, index) => (
              <motion.div
                key={invitation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  easing: "ease-out",
                  delay: 0.03 * index,
                }}
              >
                <InviteCard
                  invitation={invitation}
                  onAccept={handleAccept}
                  isAccepting={isAccepting}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Seção: aceitos */}
      {accepted.length > 0 && (
        <section className="space-y-3">
          <motion.h2
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, easing: "ease-out" }}
            className="text-sm font-semibold uppercase tracking-wide text-foreground-500"
          >
            Convites aceitos
          </motion.h2>
          <div className="grid gap-4 md:grid-cols-2">
            {accepted.map((invitation, index) => (
              <motion.div
                key={invitation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  easing: "ease-out",
                  delay: 0.03 * index,
                }}
              >
                {/* <InviteCard invitation={invitation} disabled /> */}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Seção: expirados */}
      {expired.length > 0 && (
        <section className="space-y-3">
          <motion.h2
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, easing: "ease-out" }}
            className="text-sm font-semibold uppercase tracking-wide text-foreground-500"
          >
            Convites expirados
          </motion.h2>
          <div className="grid gap-4 md:grid-cols-2">
            {expired.map((invitation, index) => (
              <motion.div
                key={invitation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  easing: "ease-out",
                  delay: 0.03 * index,
                }}
              >
                {/* <InviteCard invitation={invitation} expired /> */}
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
