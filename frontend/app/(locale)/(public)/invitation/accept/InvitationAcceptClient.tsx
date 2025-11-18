// app/[locale]/(public)/invitation/accept/InvitationAcceptClient.tsx
"use client"

import { FC } from "react"
import { useRouter } from "next/navigation"
import { useInvitation } from "@/hooks/invitations/useInvitation"
import { useAcceptInvitation } from "@/hooks/invitations/useAcceptInvitation"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { addToast } from "@heroui/toast"

type InvitationAcceptClientProps = {
  invitationId: string
}

const InvitationAcceptClient: FC<InvitationAcceptClientProps> = ({
  invitationId,
}) => {
  const router = useRouter()

  // Carrega detalhes do convite
  const {
    data: invitation,
    isLoading,
    isError,
    error,
  } = useInvitation(invitationId)

  // Mutation para aceitar
  const { mutateAsync: acceptInvitation, isPending: isAccepting } =
    useAcceptInvitation()

  const handleGoToLogin = () => {
    router.push(`/sign-in?redirect=/invitation/accept?token=${invitationId}`)
  }

  const handleAccept = async () => {
    try {
      const result: any = await acceptInvitation(invitationId)

      addToast({
        title: "Convite aceito com sucesso",
        description: "Você agora faz parte desta instituição.",
      })

      const institutionId =
        result?.institution_id ?? result?.institution?.institution_id

      if (institutionId) {
        router.push(`/institutions/${institutionId}`)
      } else {
        router.push("/institutions")
      }
    } catch (err: any) {
      const status = err?.status ?? err?.response?.status ?? err?.cause?.status

      if (status === 401) {
        addToast({
          color: "danger",
          title: "Você precisa estar autenticado",
          description: "Faça login para aceitar o convite.",
        })
        handleGoToLogin()
        return
      }

      addToast({
        color: "danger",
        title: "Não foi possível aceitar o convite",
        description: "Tente novamente em alguns instantes.",
      })
    }
  }

  // estado: carregando detalhes do convite
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando convite...</span>
        </div>
      </div>
    )
  }

  // estado: erro ao buscar convite
  if (isError || !invitation) {
    const status =
      (error as any)?.status ??
      (error as any)?.response?.status ??
      (error as any)?.cause?.status

    const isUnauthorized = status === 401
    const isForbidden = status === 403

    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>
              {isForbidden
                ? "Este convite não pertence à sua conta"
                : "Convite inválido ou indisponível"}
            </CardTitle>
            <CardDescription>
              {isForbidden
                ? "Você está autenticado com um e-mail diferente daquele para o qual o convite foi enviado. Tente sair da sua conta atual e fazer login com o e-mail que recebeu o convite."
                : isUnauthorized
                  ? "Você precisa estar autenticado para visualizar este convite."
                  : "Este convite pode ter expirado, sido cancelado ou não existe mais."}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex justify-end gap-2">
            {isUnauthorized || isForbidden ? (
              <Button onClick={handleGoToLogin}>Ir para login</Button>
            ) : (
              <Button variant="outline" onClick={() => router.push("/home")}>
                Voltar para a página inicial
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }


  // estado: convite carregado com sucesso
  const institutionName = invitation.institution?.name ?? "Instituição"
  const inviterName =
    invitation.invited_by_user?.full_name ?? "Um administrador"
  const role = invitation.role

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Convite para entrar em {institutionName}</CardTitle>
          <CardDescription>
            Você foi convidado por {inviterName} para participar desta
            instituição com o papel de{" "}
            <span className="font-semibold">{role}</span>.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground">
            Ao aceitar, sua conta será vinculada a esta instituição. Você poderá
            acessar turmas, materiais e demais recursos conforme suas
            permissões.
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/home")}
              disabled={isAccepting}
            >
              Cancelar
            </Button>
            <Button onClick={handleAccept} disabled={isAccepting}>
              {isAccepting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Aceitar convite
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InvitationAcceptClient
