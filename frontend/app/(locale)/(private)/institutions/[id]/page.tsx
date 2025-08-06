// app/(locale)/(private)/institution/[id]/page.tsx
import InstitutionClient from "./InstitutionClient"

export default function InstitutionPage({
  params,
}: {
  params: { id: string }
}) {
  // Server Component: parâmetros já validados pela rota
  return <InstitutionClient params={params} />
}
