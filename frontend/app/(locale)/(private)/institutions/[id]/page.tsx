import InstitutionClient from "./InstitutionClient"

type PageProps = {
  institutionId: string
}

export default async function InstitutionPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  return <InstitutionClient institutionId={id} />
}
