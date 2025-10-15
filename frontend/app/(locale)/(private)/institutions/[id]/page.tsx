// NADA de "use client" aqui.
// NADA de next/router / next/navigation aqui.

import InstitutionClient from "./InstitutionClient"

type PageProps = {
  params: { id: string }
}

export default function InstitutionPage({ params }: PageProps) {
  return <InstitutionClient institutionId={params.id} />
}
