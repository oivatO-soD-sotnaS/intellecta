import PeopleManageClient from "./components/PeopleManageClient"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  return <PeopleManageClient institutionId={id} />
}
