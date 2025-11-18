// app/(locale)/(public)/invitation/accept/page.tsx

import { notFound } from "next/navigation"
import InvitationAcceptClient from "./InvitationAcceptClient"

type InvitationAcceptPageProps = {
  searchParams: Promise<{
    token?: string
  }>
}

export default async function InvitationAcceptPage(
  props: InvitationAcceptPageProps
) {
  const { token } = await props.searchParams

  if (!token) {
    notFound()
  }

  return <InvitationAcceptClient invitationId={token} />
}
