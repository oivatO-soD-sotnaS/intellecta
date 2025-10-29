import InstitutionOwenClient from "./components/InstitutionOwenClient"

export default function Page({ params }: { params: { id: string } }) {
  return <InstitutionOwenClient institutionId={params.id} />
}
