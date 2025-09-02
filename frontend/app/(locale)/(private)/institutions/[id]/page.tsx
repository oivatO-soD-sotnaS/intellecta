// app/(locale)/(private)/institution/[id]/page.tsx

import InstitutionPageClient from "./InstitutionClient"

export default async function InstitutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params 
  return (
    <div className="p-6">
      <h3>🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧</h3>
      <h1>Esta página está em construção 🏗️</h1>
      <h2>{id}</h2>
      <h3>🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧</h3>
    </div>
  )
}
