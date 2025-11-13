// app/(locale)/(private)/invites/page.tsx
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import InvitesClient from "./components/InvitesClient"

type Props = {
  searchParams: Promise<{ token?: string }>
}

export default async function InvitesPage({ searchParams }: Props) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/sign-in")
  }

  const { token: invitationToken } = await searchParams

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full">
      <InvitesClient invitationToken={invitationToken} />
    </div>
  )
}
