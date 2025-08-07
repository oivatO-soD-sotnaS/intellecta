// app/(locale)/(private)/institution/[id]/page.tsx

import InstitutionPageClient from "./InstitutionClient"

export default async function InstitutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params 
  return <InstitutionPageClient id={id} />}
