import PeopleManageClient from "./components/PeopleManageClient"

export default function Page({ params }: { params: { id: string } }) {
  return <PeopleManageClient institutionId={params.id} />
}
